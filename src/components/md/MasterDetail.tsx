import {useContext, useEffect, useState} from "react";
import {ordersApi} from "../../api/OrdersAPI";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {Card, Modal} from "react-bootstrap";
import {Master} from "./Master";
import {EditOrder} from "../orders/EditOrder";
import {CustomButton} from "../ui/CustomButton";
import {NewOrder} from "../orders/NewOrder";
import {findNextOrderStatus, OrderStatus} from "../../domain/Order";
import {AlertToast} from "../ui/AlertToast";

export const MasterDetail = () => {
    const [orders, setOrders] = useState([]);
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [edit, setEdit] = useState({
        show: false,
        op: "",
        orderId: ""
    })

    useEffect(() => {
        if (!appCtx.userData.authToken) {
            return;
        }
        loadOrders();
    }, [appCtx]);

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
            loadOrders();
        }
    }, [appCtx.alert.show])

    const handleEdit = (op: string, orderId: string) => {
        setEdit({
            show: true,
            op: op,
            orderId: orderId
        });
    }

    const loadOrders = () => {
        ordersApi
            .withToken(appCtx.userData.authToken)
            .list()
            .then((result) => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                    setOrders([]);
                } else {
                    setOrders(result);
                }
            });
    }

    const handleEditSave = () => {
        loadOrders();
        setEdit({
            show: false,
            op: "",
            orderId: ""
        });
    }

    const handleEditCancel = () => {
        loadOrders();
        setEdit({
            show: false,
            op: "",
            orderId: ""
        });
    }

    const updateOrder = async (orderId: string, order) => {
        const result = await ordersApi.withToken(appCtx.userData.authToken).update(orderId, order);
        if (result._id === orderId) {
            // do nothing
        } else if (result.statusCode) {
            if (result.statusCode === StatusCodes.UNAUTHORIZED) {
                appCtx.showErrorAlert(result.name, result.description);

            } else if (result.statusCode === StatusCodes.BAD_REQUEST ||
                result.statusCode === StatusCodes.NOT_FOUND ||
                result.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
                appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
            }
            handleEditCancel();
        }
    }

    const handleConfirmOrder = (orderId) => {
        const o = {
            status: OrderStatus.CONFIRMED
        }
        updateOrder(orderId, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.SUCCESS, "Confirm Order", `Order '${orderId}' updated successfully`);
                setShowAlert(true);
                loadOrders();
            });
    }

    const handleCancelOrder = (orderId, cancelReason) => {
        const o = {
            status: OrderStatus.CANCELED,
            statusReason: cancelReason
        }
        updateOrder(orderId, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.WARNING, "Cancel Order", `Order '${orderId}' has been canceled`);
                setShowAlert(true);
                loadOrders();
            });
    }

    const handleForwardOrder = (order, forwardReason) => {
        const o = {
            status: findNextOrderStatus(order.status),
            statusReason: forwardReason
        }
        updateOrder(order._id, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.SUCCESS, "Update Order Status", `Order '${order._id}' status updated to ${OrderStatus[o.status]} successfully`);
                setShowAlert(true);
                loadOrders();
            });
    }

    const handleDeleteOrder = async (orderId) => {
        if (!appCtx.userData.authToken) return;
        ordersApi.withToken(appCtx.userData.authToken).delete(orderId)
            .then(result => {
                if (result && result.statusCode !== StatusCodes.NO_CONTENT) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                } else {
                    appCtx.handleAlert(true, AlertType.WARNING, "Delete Order", `Order '${orderId}' deleted successfully`);
                    setShowAlert(true);
                }
                loadOrders();
            })
    }

    const listing = (
        <div>
            {showAlert &&
                <AlertToast/>
            }
            <Card border="dark" style={{margin: "1rem"}}>
                <Card.Header as="h3">Orders</Card.Header>
                <Card.Body>
                    <div>
                        <CustomButton
                            caption="New Order"
                            type="new"
                            customClass="fa fa-file-invoice"
                            onClick={() => handleEdit("new", "")}/>
                    </div>
                    {orders.map(order => {
                        return (
                            <Master key={order._id} order={order} onEditOrder={handleEdit}
                                    onDelete={handleDeleteOrder} onConfirm={handleConfirmOrder}
                                    onForwardOrder={handleForwardOrder} onCancelOrder={handleCancelOrder}/>
                        );
                    })}
                </Card.Body>
            </Card>
        </div>
    )

    const viewing = (
        <div>
            <Modal
                show={edit.show}
                size="lg"
                onHide={handleEditCancel}
                backdrop="static"
                centered
                keyboard={true}>
                <Modal.Body>
                    {edit.op === "new" ?
                        <NewOrder onSave={handleEditSave} onCancel={handleEditCancel}/> :
                        <EditOrder id={edit.orderId} op={edit.op} onSave={handleEditSave} onCancel={handleEditCancel}/>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )

    return (
        <>
            {listing}
            {viewing}
        </>
    )
}