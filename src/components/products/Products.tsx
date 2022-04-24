import {useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {productsApi} from "../../api/ProductsAPI";
import {ProductsList} from "./ProductsList";
import {CustomButton} from "../ui/CustomButton";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {EditProductForm} from "./EditProductForm";
import Modal from "../ui/Modal";
import {Role} from "../../domain/User";

export const Products = () => {
    const appCtx = useContext(ApplicationContext);
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

    const handleDelete = async (product) => {
        if (!appCtx.userData.authToken) return;

        const result = await productsApi.withToken(appCtx.userData.authToken).delete(product._id);
        if (!result) {
            appCtx.handleAlert(true, AlertType.WARNING, "Delete Product", `Product '${product.name}' deleted successfully`);
            setShowAlert(true);
            productsApi.list().then((data) => {
                setProducts(data);
            });
        } else {
            if (result.statusCode in [StatusCodes.INTERNAL_SERVER_ERROR, StatusCodes.BAD_REQUEST, StatusCodes.NOT_FOUND]) {
                appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                setShowAlert(true);
            }
        }
    }

    const handleShowEditModal = (op: string, id?: string) => {
        const callback = async () => {
            if (op === "edit" || op === "view") {
                const p = await productsApi.get(id);
                setProduct(p);
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
        if (!appCtx.userData.authToken) return;

        const save = async (product) => {
            let result;
            if (editViewOp.op === "edit") {
                result = await productsApi.withToken(appCtx.userData.authToken).update(editViewOp.productId, product)
            } else if (editViewOp.op === "new") {
                result = await productsApi.withToken(appCtx.userData.authToken).create(product);
            }
            if (result.statusCode) {
                if (result.statusCode in [StatusCodes.UNAUTHORIZED, StatusCodes.BAD_REQUEST, StatusCodes.INTERNAL_SERVER_ERROR]) {
                    handleSave(result);
                }
            } else {
                handleSave();
            }
        }
        save(product)
            .then(() => undefined);
    }

    const handleSave = (error?) => {
        setShowEditModal(false);
        if (error) {
            const errorDescription = error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR ?
                    error.description.message:
                    error.description
            appCtx.handleAlert(true, AlertType.DANGER, error.name, errorDescription);
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
        productsApi.list()
            .then(data => {
                setProducts(data);
            });
    }, [showEditModal])

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

    return (
        <div>
            {showAlert && <AlertToast/>}
            <Card border="dark">
                <Card.Header as="h3">Products</Card.Header>
                <Card.Body>
                    { appCtx.userData.role === Role.ADMIN &&
                        <Card.Title>
                            <CustomButton
                                caption="New Product"
                                type="new"
                                customClass="fa fa-box-open"
                                onClick={handleNewProduct} />
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
                        onClose={handleCancel} >
                        <div>
                            <EditProductForm product={product} op={editViewOp.op} onSave={handleSaveProduct} onCancel={handleCancel}/>
                        </div>
                    </Modal>
                }

            </div>
        </div>
    );
}
