import {useContext, useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import {productsApi} from "../../api/ProductsAPI";
import {ProductsList} from "./ProductsList";
import {EditProduct} from "./EditProduct";
import {CustomButton} from "../ui/CustomButton";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const Products = () => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        productId: "",
        op: ""
    });

    const handleDelete = () => {
        productsApi.list().then((data) => {
            setProducts(data);
        });
        appCtx.handleAlert(true, AlertType.DANGER, "Delete Product", "Product has been deleted successfully");
        setShowAlert(true);
    }

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            productId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            const errorDescription = error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR ?
                    error.description.message:
                    error.description
            appCtx.handleAlert(true, AlertType.DANGER, error.name, errorDescription);
            setShowAlert(true);
        }
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

    const viewOnly = editViewOp.op === "view";


    return (
        <div className="container4">
            {showAlert && <AlertToast/>}
            <div>
                <Card border="dark" className="align-content-center">
                    <Card.Header as="h3">Products</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <CustomButton
                                caption="New Product"
                                type="new"
                                customClass="fa fa-box-open"
                                onClick={() => handleShowEditModal("new")} />
                        </Card.Title>
                        <ProductsList 
                            products={products} 
                            onDelete={handleDelete} 
                            onEdit={handleShowEditModal}/>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Modal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    backdrop="static"
                    centered
                    style={{ justifyItems: "center", margin: "auto"}}
                    size={viewOnly?"xl": "lg"}
                    keyboard={true}>
                    <Modal.Body>
                        <div className="container4">
                            <EditProduct id={editViewOp.productId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}

/*

<Container fluid style={{padding: "0.5rem", display: "flex", justifyContent: "center"}}>
    <Row>
        <Col>
            <Card border="dark" className="align-content-center" style={{width: "100rem"}}>
                <Card.Header as="h3">Products</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <Button caption="New Product" onClick={() => handleShowEditModal("new")} type="new"/>
                    </Card.Title>
                    <ProductsList products={products} onDelete={handleShowToast}
                                    onEdit={handleShowEditModal}/>
                </Card.Body>
            </Card>
        </Col>
        <Col>
            <Toast show={showToast} onClose={handleCloseToast} delay={TOAST_TIMEOUT} autohide>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                    <strong className="me-auto">Products</strong>
                    <small>just now</small>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Col>
    </Row>
    <Row>
        <Modal show={showEditModal}
                onHide={handleCloseEditModal}
                backdrop="static" keyboard={true} centered
                size={viewOnly?"xl": "lg"}
                className="align-content-center">
            <Modal.Body>
                <EditProduct id={editViewOp.productId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
            </Modal.Body>
        </Modal>
    </Row>
</Container>

*/