import {useEffect, useState} from "react";
import {Alert, Card, Modal} from "react-bootstrap";
import {productsApi} from "../../api/ProductsAPI";
import {ProductsList} from "./ProductsList";
import {EditProduct} from "./EditProduct";
import {CustomButton} from "../ui/CustomButton";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        productId: "",
        op: ""
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
        }, 3000)}
    };

    const handleDelete = () => {
        productsApi.list().then((data) => {
            setProducts(data);
        });
        handleAlert(true, "danger", "Delete Product", "Product has been deleted successfuly")
    }

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            productId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    useEffect(() => {
        productsApi.list()
            .then(data => {
                setProducts(data);
            });
    }, [showEditModal])

    const viewOnly = editViewOp.op === "view";


    return (
        <div className="container4">
            {alert.show && (
                <div className="alert-top">
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible>
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            )}
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