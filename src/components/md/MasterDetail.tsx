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
    }, [appCtx]);

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

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
                    console.log("loading...")
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

    const handleConfirmOrder = (orderId) => {
        const o = {
            status: OrderStatus.CONFIRMED
        }
        ordersApi.update(orderId, o)
            .then((o) => {
                if (o) {
                    appCtx.handleAlert(true, AlertType.SUCCESS, "Confirm Order", `Order '${orderId}' updated successfully`);
                    setShowAlert(true);
                    loadOrders();
                }
            });
    }

    const handleCancelOrder = (orderId, cancelReason) => {
        console.log("md 119", cancelReason)
        const o = {
            status: OrderStatus.CANCELED,
            statusReason: cancelReason
        }
        console.log("order being sent", o)
        ordersApi.update(orderId, o)
            .then((result) => {
                loadOrders();
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    handleEditCancel();
                } else if (result.statusCode && result.statusCode === StatusCodes.BAD_REQUEST) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    handleEditCancel();
                } else if (result.statusCode && result.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    handleEditCancel();
                } else {
                    appCtx.handleAlert(true, AlertType.WARNING, "Cancel Order", `Order '${orderId}' has been canceled`);
                    setShowAlert(true);
                }
            });
    }

    const handleForwardOrder = (order) => {
        const o = {
            status: findNextOrderStatus(order.status)
        }
        ordersApi.update(order._id, o)
            .then((o) => {
                if (o) {
                    appCtx.handleAlert(true, AlertType.SUCCESS, "Update Order Status", `Order '${order._id}' status updated to ${OrderStatus[o.status]} successfully`);
                    setShowAlert(true);
                    loadOrders();
                }
            });
    }

    const listing = (
        <div>
            {showAlert &&
                <AlertToast />
            }
            <Card border="dark" style={{ margin: "1rem"}}>
                <Card.Header as="h3">Orders</Card.Header>
                <Card.Body>
                    <div>
                        <CustomButton
                            caption="New Order"
                            type="new"
                            customClass="fa fa-file-invoice"
                            onClick={() => handleEdit("new", "")} />
                    </div>
                    {orders.map(order => {
                        return (
                            <Master key={order._id} order={order} onEditOrder={handleEdit}
                                onDelete={handleDeleteOrder} onConfirm={handleConfirmOrder}
                                    onForward={handleForwardOrder} onCancelOrder={handleCancelOrder}/>
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
                    {edit.op === "new"?
                        <NewOrder onSave={handleEditSave} onCancel={handleEditCancel} />:
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