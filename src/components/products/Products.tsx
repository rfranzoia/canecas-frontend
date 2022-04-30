import { useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Role, User } from "../../domain/User";
import useProductsApi from "../../hooks/useProductsApi";
import { RootState } from "../../store";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";
import { EditProductForm } from "./EditProductForm";
import { ProductsList } from "./ProductsList";

export const Products = () => {
    const loggedUser = useSelector<RootState, User>((state) => state.auth.user);
    const { products, list, create, update, get, remove } = useProductsApi();
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
        const result = await remove(product);
        result();
        setShowAlert(true);
    }

    const handleShowEditModal = async (op: string, id?: string) => {
        if (op === "edit" || op === "view") {
            const product = await get(id);
            if (product) {
                setProduct(product);
            }
        } else {
            setProduct({
                name: "",
                description: "",
                price: 0,
                image: ""
            })
        }
        setEditViewOp({
            productId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleSaveProduct = async (product) => {
        let error;
        if (editViewOp.op === "edit") {
            error = await update(editViewOp.productId, product);

        } else if (editViewOp.op === "new") {
            error = await create(product);
        }

        if (error) {
            error();
            setShowAlert(true);
        }

        setShowEditModal(false);
        await list();
    }


    const handleCancel = () => {
        setShowEditModal(false);
    }

    const handleNewProduct = async () => {
        await handleShowEditModal("new");
    }

    return (
        <div>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark">
                <Card.Header as="h3">Products</Card.Header>
                <Card.Body>
                    {loggedUser.role === Role.ADMIN &&
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
                            <EditProductForm product={product}
                                             op={editViewOp.op}
                                             onSave={handleSaveProduct}
                                             onCancel={handleCancel}/>
                        </div>
                    </Modal>
                }

            </div>
        </div>
    );
}
