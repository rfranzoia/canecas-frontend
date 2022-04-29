import { StatusCodes } from "http-status-codes";
import { useCallback, useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { productsApi } from "../../api/ProductsAPI";
import { ApplicationContext } from "../../context/ApplicationContext";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";
import { EditProductForm } from "./EditProductForm";
import { ProductsList } from "./ProductsList";

export const Products = () => {
    const appCtx = useContext(ApplicationContext);
    const user = useSelector<RootState, User>(state => state.auth.user);
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        productId: "",
        op: ""
    });
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        image: ""
    });
    const { getToken } = appCtx;

    const loadProducts = useCallback(async () => {
        productsApi.list()
            .then(result => {
                if (result.statusCode === StatusCodes.OK) {
                    setProducts(result.data);
                } else {
                    setProducts([]);
                }
            });
    }, []);

    const handleDelete = async (product) => {
        if (!getToken()) return;

        const result = await productsApi.withToken(getToken()).delete(product._id);
        if (!result) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.WARNING,
                title: "Delete Product",
                message: `Product '${product.name}' deleted successfully`
            }));
            setShowAlert(true);

        } else {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
            setShowAlert(true);
        }
        loadProducts().then(undefined);
    }

    const handleShowEditModal = (op: string, id?: string) => {
        const callback = async () => {
            if (op === "edit" || op === "view") {
                const result = await productsApi.get(id);
                if (result.statusCode === StatusCodes.OK) {
                    setProduct(result.data);
                }
            } else {
                setProduct({
                    name: "",
                    description: "",
                    price: 0,
                    image: ""
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });
        setEditViewOp({
            productId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleSaveProduct = (product) => {
        const save = async (product) => {
            let result;
            if (editViewOp.op === "edit") {
                result = await productsApi.withToken(getToken()).update(editViewOp.productId, product)
            } else if (editViewOp.op === "new") {
                result = await productsApi.withToken(getToken()).create(product);
            }
            if (result.statusCode !== StatusCodes.OK) {
                handleSave(result);
            } else {
                handleSave();
            }
        }
        save(product).then(undefined);
    }

    const handleSave = (error?) => {
        setShowEditModal(false);
        if (error) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: error.name,
                message: error.description
            }));
            setShowAlert(true);
        }
    }

    const handleCancel = () => {
        setShowEditModal(false);
    }

    const handleNewProduct = () => {
        handleShowEditModal("new");
    }

    useEffect(() => {
        loadProducts().then(undefined);
    }, [showEditModal, loadProducts])

    return (
        <div>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark">
                <Card.Header as="h3">Products</Card.Header>
                <Card.Body>
                    {user.role === Role.ADMIN &&
                        <Card.Title>
                            <CustomButton
                                caption="New Product"
                                type="new"
                                customClass="fa fa-box-open"
                                onClick={handleNewProduct}/>
                        </Card.Title>
                    }
                    <ProductsList
                        products={products}
                        onDelete={handleDelete}
                        onEdit={handleShowEditModal}/>
                </Card.Body>
            </Card>
            <div>
                {showEditModal &&
                    <Modal
                        onClose={handleCancel}>
                        <div>
                            <EditProductForm product={product} op={editViewOp.op} onSave={handleSaveProduct}
                                             onCancel={handleCancel}/>
                        </div>
                    </Modal>
                }

            </div>
        </div>
    );
}
