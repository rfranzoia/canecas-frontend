import {useContext, useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import {ordersApi} from "../../api/OrdersAPI";
import {OrdersList} from "./OrdersList";
import {EditOrder} from "./EditOrder";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {useHistory} from "react-router-dom";
import {StatusCodes} from "http-status-codes";
import {CustomButton} from "../ui/CustomButton";
import {OrderAction} from "../../domain/Order";
import {AlertToast} from "../ui/AlertToast";

export const Orders = () => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [orders, setOrders] = useState([]);
    const [showEdit, setShowEdit] = useState({
        type: "",
        show: false,
    });

    const [editViewOp, setEditViewOp] = useState({
        orderId: "",
        op: "",
    });

    const load = async () => {
        const result = await ordersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
            appCtx.showErrorAlert(result.name, result.description);
            setOrders([]);
        } else {
            setOrders(result);
        }
    };

    useEffect(() => {
        if (!appCtx.userData.authToken) {
            appCtx.showErrorAlert("Invalid request!", "Unauthorized access");
            return;
        }

        ordersApi
            .withToken(appCtx.userData.authToken)
            .list()
            .then((result) => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                    setOrders([]);
                } else {
                    setOrders(result);
                }
            });
    }, [appCtx]);

    const handleAction = (action: OrderAction) => {
        if (action === OrderAction.DELETE) {
            appCtx.handleAlert(true, AlertType.DANGER, "Order Delete", "Order deleted successfully");
        } else if (action === OrderAction.CONFIRM) {
            appCtx.handleAlert(true, AlertType.SUCCESS, "Order Confirm", "The order has been confirmed");
        } else if (action === OrderAction.FORWARD) {
            appCtx.handleAlert(true, AlertType.WARNING, "Order Status Change", "The Order status has been updated successfully");
        }
        load().then(() => undefined);
    };

    const handleNewOrder = (id: string) => {
        history.push(`/orders/${id}`);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            orderId: id,
            op: op,
        });

        if (op === "view") {
            setShowEdit({
                type: "modal",
                show: true,
            });
        } else {
            history.push(`/orders/${id}`);
            setShowEdit({
                type: op,
                show: true,
            });
        }
    };

    const handleCloseEditModal = () => {
        setShowEdit({
            type: "",
            show: false,
        });
    };

    const contentList = (
        <>
            <AlertToast />
            <Card border="dark">
                <Card.Header as="h3">Orders</Card.Header>
                <Card.Body>
                    <div>
                        <div>
                            <CustomButton
                                caption="New Order"
                                type="new"
                                customClass="fa fa-file-invoice"
                                onClick={() => handleNewOrder("new")}/>
                        </div>
                        <br/>
                        <div>
                            <OrdersList
                                orders={orders}
                                onDelete={() => handleAction(OrderAction.DELETE)}
                                onConfirm={() => handleAction(OrderAction.CONFIRM)}
                                onForward={() => handleAction(OrderAction.FORWARD)}
                                onEdit={handleShowEditModal}
                            />
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );

    const contentEdit = <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>;

    return (
        <div className="container4">
            {showEdit.show && showEdit.type !== "modal" ? contentEdit : contentList}
            <Modal
                show={showEdit.show && showEdit.type === "modal"}
                size="lg"
                onHide={handleCloseEditModal}
                backdrop="static"
                centered
                keyboard={true}>
                <Modal.Body>
                    <EditOrder id={editViewOp.orderId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                </Modal.Body>
            </Modal>
        </div>
    );
};
