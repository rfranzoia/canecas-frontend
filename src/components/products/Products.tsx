import {useCallback, useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {productsApi} from "../../api/ProductsAPI";
import {ProductsList} from "./ProductsList";
import {CustomButton} from "../ui/CustomButton";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {EditProductForm} from "./EditProductForm";
import Modal from "../ui/Modal";
import {Role, User} from "../../domain/User";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export const Products = () => {
    const appCtx = useContext(ApplicationContext);
    const user = useSelector<RootState, User>(state => state.auth.user);
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
    const {handleAlert, getToken} = appCtx;

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
            handleAlert(true, AlertType.WARNING, "Delete Product", `Product '${product.name}' deleted successfully`);
            setShowAlert(true);

        } else {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
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
            handleAlert(true, AlertType.DANGER, error.name, error.description);
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

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    }, [appCtx.alert.show])

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
