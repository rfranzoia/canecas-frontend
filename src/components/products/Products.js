import {useEffect, useState} from "react";
import {Card, Col, Container, Modal, Row, Toast} from "react-bootstrap";
import {productsApi} from "../../api/ProductsAPI";
import {ProductsList} from "./ProductsList";
import {EditProduct} from "./EditProduct";
import {Button} from "../ui/Button";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        productId: "",
        op: ""
    });

    const TOAST_TIMEOUT = 3 * 1000;

    useEffect(() => {
        productsApi.list()
            .then(data => {
                setProducts(data);
            });
    }, [showEditModal])

    const handleNewProduct = () => {
        handleShowEditModal("new")
    }

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            productsApi.list()
                .then(data => {
                    setProducts(data);
                    setShowToast(show);
                });
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            productId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    const viewOnly = editViewOp.op === "view";

    return (
        <Container fluid style={{padding: "0.5rem", display: "flex", justifyContent: "center"}}>
            <Row>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: "100rem"}}>
                        <Card.Header as="h3">Products</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <Button caption="New Product" onClick={() => handleNewProduct("new")} type="new"/>
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
    );
}