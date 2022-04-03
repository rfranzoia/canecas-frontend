import {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Modal, Row, Toast} from "react-bootstrap";
import {ordersApi} from "../../api/OrdersAPI";
import {OrdersList} from "./OrdersList";
import {EditOrder} from "./EditOrder";
import {ApplicationContext} from "../../context/ApplicationContext";
import {useHistory} from "react-router-dom";

export const OrderStatus = [
    {value: "NEW", id: 0},
    {value: "CONFIRMED", id: 1},
    {value: "IN_PRODUCTION", id: 2},
    {value: "READY_TO_DELIVER", id: 3},
    {value: "FINISHED", id: 8},
    {value: "CANCELED", id: 9}];

export const getOrderStatusValue = (id) => {
    return OrderStatus.find(os => os.id === id).value
}
export const Orders = () => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [orders, setOrders] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showEdit, setShowEdit] = useState({
        type: "",
        show: false
    });
    const [editViewOp, setEditViewOp] = useState({
        orderId: "",
        op: ""
    });

    const TOAST_TIMEOUT = 3 * 1000;

    useEffect(() => {
        if (!appCtx.userData.authToken) return;

        ordersApi.withToken(appCtx.userData.authToken).list()
            .then(data => {
                if (!data) {
                    setOrders([]);
                } else {
                    setOrders(data);
                }
            });
    }, [showEdit, appCtx.userData.authToken])

    const handleNewOrder = (id) => {
        history.push(`/orders/${id}`);
    }

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            ordersApi.withToken(appCtx.userData.authToken).list()
                .then(data => {
                    setOrders(data);
                    setShowToast(show);
                });
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            orderId: id,
            op: op
        });

        if (op === "view") {
            setShowEdit({
                type: "modal",
                show: true
            });
        } else {
            history.push(`/orders/${id}`);
            setShowEdit({
                type: op,
                show: true
            });
        }
    }

    const handleCloseEditModal = () => {
        setShowEdit({
            type: "",
            show: false
        });
    }

    const contentList = (
        <Container fluid style={{ display: "flex", justifyContent: "center" }}>
            <Row>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '70rem'}}>
                        <Card.Header as="h3">Orders</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <Button
                                    variant="success"
                                    onClick={() => handleNewOrder("new")}>New Order
                                </Button>
                            </Card.Title>
                            <OrdersList orders={orders} onDelete={handleShowToast} onConfirm={handleShowToast}
                                        onEdit={handleShowEditModal}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Toast show={showToast} onClose={handleCloseToast} delay={TOAST_TIMEOUT} autohide>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                            <strong className="me-auto">Orders</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </Col>
            </Row>

        </Container>
    )

    const contentEdit = (
        <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
    )

    return (
        <>
            <div>
                {(showEdit.show && showEdit.type !== "modal") ? contentEdit : contentList}
            </div>
            <div>
                <Modal show={showEdit.show && showEdit.type === "modal"} onHide={handleCloseEditModal} backdrop="static" centered
                       keyboard={true} size="lg">
                    <Modal.Body>
                        <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}