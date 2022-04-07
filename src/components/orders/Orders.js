import {useContext, useEffect, useState} from "react";
import {Card, Modal, Toast} from "react-bootstrap";
import {ordersApi} from "../../api/OrdersAPI";
import {OrdersList} from "./OrdersList";
import {EditOrder} from "./EditOrder";
import {ApplicationContext} from "../../context/ApplicationContext";
import {useHistory} from "react-router-dom";
import {StatusCodes} from "http-status-codes";
import {Button} from "../ui/Button";

export const OrderStatus = [
    {value: "NEW", id: 0},
    {value: "CONFIRMED", id: 1},
    {value: "IN_PRODUCTION", id: 2},
    {value: "READY_TO_DELIVER", id: 3},
    {value: "FINISHED", id: 8},
    {value: "CANCELED", id: 9}];


export const getCurrentOrderStatus = (statusId) => {
    return (OrderStatus.findIndex(status => status.id === statusId));
}
export const getNextOrderStatus = (statusId) => {
    return (OrderStatus.findIndex(status => status.id === statusId)) + 1;
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

    const load = async () => {
        const result = await ordersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
            appCtx.showErrorAlert(result.name, result.description);
            setOrders([]);
        } else {
            setOrders(result)
        }
    }

    useEffect(() => {
        if (!appCtx.userData.authToken) {
            appCtx.showErrorAlert("Invalid request!", "Unauthorized access");
            return;
        }

        ordersApi.withToken(appCtx.userData.authToken).list()
            .then(result => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                    setOrders([]);
                } else {
                    setOrders(result)
                }
            });
    }, [appCtx])

    const handleNewOrder = (id) => {
        history.push(`/orders/${id}`);
    }

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            load().then(() => setShowToast(show));
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
        <div>
            <div>
                <Card border="dark" style={{justifyContent: "center", alignContent: "center", margin: "2rem"}}>
                    <Card.Header as="h3">Orders</Card.Header>
                    <Card.Body>
                        <div>
                            <div>
                                <Button caption="New Order" onClick={() => handleNewOrder("new")} type="new"/>
                            </div>
                            <br/>
                            <div>
                                <OrdersList orders={orders}
                                            onDelete={handleShowToast}
                                            onConfirm={handleShowToast}
                                            onForward={handleShowToast}
                                            onEdit={handleShowEditModal}/>
                            </div>

                        </div>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Toast show={showToast} onClose={handleCloseToast} delay={TOAST_TIMEOUT} autohide>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                        <strong className="me-auto">Orders</strong>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </div>
        </div>
    );

    const contentEdit = (
        <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
    )

    return (
        <>
            <div>
                {(showEdit.show && showEdit.type !== "modal") ? contentEdit : contentList}
            </div>
            <div>
                <Modal show={showEdit.show && showEdit.type === "modal"} size="lg"
                       onHide={handleCloseEditModal} backdrop="static" centered keyboard={true}>
                    <Modal.Body>
                        <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                    </Modal.Body>
                </Modal>
            </div>
        </>
    );
}