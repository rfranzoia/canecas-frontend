import {useContext, useEffect, useState} from "react";
import {ordersApi} from "../../api/OrdersAPI";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {EditOrder} from "./EditOrder";
import {NewOrder} from "./NewOrder";
import {findNextOrderStatus, OrderStatus} from "../../domain/Order";
import {OrdersList} from "./OrdersList";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";
import {DEFAULT_PAGE_SIZE} from "../../api/axios";
import {User} from "../../domain/User";

import styles from "./orders.module.css"

export interface WizardFormData {
    _id?: string,
    user?: User,
    product?: string,
    price?: number,
    drawings?: number,
    drawingsImages?: string,
    drawingsImagesFile?: object,
    background?: string,
    backgroundDescription?: string,
    backgroundImage?: string,
    backgroundImageFile?: object,
    amount: number,
}

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: 0
    });
    const [edit, setEdit] = useState({
        show: false,
        op: "",
        orderId: ""
    })

    const loadOrders = (currPage: number) => {
        if (!appCtx.userData.authToken) {
            setOrders([]);
            return;
        }

        setPageControl(prevState => ({
            ...prevState,
            currPage: currPage
        }));

        ordersApi
            .withToken(appCtx.userData.authToken)
            .list(currPage)
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

    const updateOrder = async (orderId: string, order) => {
        if (!appCtx.userData.authToken) {
            return;
        }

        const result = await ordersApi.withToken(appCtx.userData.authToken).update(orderId, order);
        if (result.statusCode) {
            if (result.statusCode === StatusCodes.BAD_REQUEST ||
                result.statusCode === StatusCodes.NOT_FOUND ||
                result.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
                appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
            }
            handleEditCancel();
        }
    }

    const getTotalPages = () => {
        ordersApi.withToken(appCtx.userData.authToken).count()
            .then(result => {
                setPageControl({
                    currPage: 1,
                    totalPages: Math.ceil(result.count / DEFAULT_PAGE_SIZE)
                });
                setTotalPages(Math.ceil(result.count / DEFAULT_PAGE_SIZE));
            });
    }

    const handleEdit = (op: string, orderId: string) => {
        setEdit({
            show: true,
            op: op,
            orderId: orderId
        });
    }

    const handleEditSave = () => {
        getTotalPages();
        loadOrders(pageControl.currPage);
        setEdit({
            show: false,
            op: "",
            orderId: ""
        });
    }

    const handleEditCancel = () => {
        loadOrders(pageControl.currPage);
        setEdit({
            show: false,
            op: "",
            orderId: ""
        });
    }

    const handleConfirmOrder = (orderId: string) => {
        const o = {
            status: OrderStatus.CONFIRMED
        }
        updateOrder(orderId, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.SUCCESS, "Confirm Order", `Order '${orderId}' updated successfully`);
                setShowAlert(true);
                loadOrders(pageControl.currPage);
            });
    }

    const handleCancelOrder = (orderId: string, cancelReason: string) => {
        const o = {
            status: OrderStatus.CANCELED,
            statusReason: cancelReason
        }
        updateOrder(orderId, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.WARNING, "Cancel Order", `Order '${orderId}' has been canceled`);
                setShowAlert(true);
                loadOrders(pageControl.currPage);
            });
    }

    const handleForwardOrder = (order, forwardReason: string) => {
        const o = {
            status: findNextOrderStatus(order.status),
            statusReason: forwardReason
        }
        updateOrder(order._id, o)
            .then(() => {
                appCtx.handleAlert(true, AlertType.SUCCESS, "Update Order Status", `Order '${order._id}' status updated to ${OrderStatus[o.status]} successfully`);
                setShowAlert(true);
                loadOrders(pageControl.currPage);
            });
    }

    const handleDeleteOrder = async (orderId: string) => {
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
                getTotalPages();
                loadOrders(pageControl.currPage);
            })
    }

    useEffect(() => {
        appCtx.checkValidLogin()
            .then(() => undefined);
    }, []);

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
        loadOrders(pageControl.currPage);
    }, [appCtx.alert.show]);

    useEffect(() => {
        getTotalPages();
    }, [])

    return (
        <>
            <div>
                {showAlert &&
                    <AlertToast/>
                }
                <OrdersList
                    orders={orders}
                    totalPages={totalPages}
                    loadOrders={loadOrders}
                    onEditOrder={handleEdit}
                    onDeleteOrder={handleDeleteOrder}
                    onCancelOrder={handleCancelOrder}
                    onConfirmOrder={handleConfirmOrder}
                    onForwardOrder={handleForwardOrder}/>
            </div>
            <div>
                { edit.show &&
                    <Modal
                        onClose={handleEditCancel}>
                        <div className={styles["edit-order-modal"]}>
                            {edit.op === "new" ?
                                <NewOrder
                                    onSave={handleEditSave}
                                    onCancel={handleEditCancel}/> :
                                <EditOrder
                                    id={edit.orderId}
                                    op={edit.op}
                                    onSave={handleEditSave}
                                    onCancel={handleEditCancel}/>}
                        </div>
                    </Modal>
                }
            </div>
        </>
    )
}