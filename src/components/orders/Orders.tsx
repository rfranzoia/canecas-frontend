import {useCallback, useContext, useEffect, useState} from "react";
import {ordersApi} from "../../api/OrdersAPI";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {NewOrder} from "./NewOrder";
import {findNextOrderStatus, OrderStatus} from "../../domain/Order";
import {OrdersList} from "./OrdersList";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";
import {DEFAULT_PAGE_SIZE} from "../../api/axios";
import {User} from "../../domain/User";

import styles from "./orders.module.css"
import EditOrder from "./EditOrder";

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
    amount?: number,
}

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [saved, setSaved] = useState(false);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: 0
    });
    const [edit, setEdit] = useState({
        show: false,
        op: "",
        orderId: ""
    })
    const { handleAlert } = appCtx;

    const updateOrder = (orderId: string, order, callback) => {

        ordersApi.withToken(appCtx.userData.authToken).update(orderId, order)
            .then(result => {
                if (result.statusCode) {
                    if (result.statusCode in [StatusCodes.BAD_REQUEST, StatusCodes.NOT_FOUND, StatusCodes.INTERNAL_SERVER_ERROR, StatusCodes.UNAUTHORIZED]) {
                        handleAlert(true, AlertType.DANGER, result.name, result.description);
                        setShowAlert(true);
                    }
                } else {
                    callback();
                }
            });
        handleEditCancel();
    }

    const handleEdit = (op: string, orderId: string) => {
        setEdit({
            show: true,
            op: op,
            orderId: orderId
        });
    }

    const handleSaveSuccessful = () => {
        getTotalPages();
        loadOrders(pageControl.currPage);
        setSaved(true);
    }

    const handleEditCancel = () => {
        setEdit({
            show: false,
            op: "",
            orderId: ""
        });
        setSaved(false);
    }

    const handleConfirmOrder = (orderId: string) => {
        const o = {
            status: OrderStatus.CONFIRMED
        }
        updateOrder(orderId, o, () => {
            handleAlert(true, AlertType.SUCCESS, "Update Order", `Order '${orderId}' updated successfully`);
            setShowAlert(true);
            loadOrders(pageControl.currPage);
        });
    }

    const handleCancelOrder = (orderId: string, cancelReason: string) => {
        const o = {
            status: OrderStatus.CANCELED,
            statusReason: cancelReason
        }
        updateOrder(orderId, o, () => {
            handleAlert(true, AlertType.WARNING, "Cancel Order", `Order '${orderId}' has been canceled`);
            setShowAlert(true);
            loadOrders(pageControl.currPage);
        });
    }

    const handleForwardOrder = (order, forwardReason: string) => {
        const o = {
            status: findNextOrderStatus(order.status),
            statusReason: forwardReason
        }
        updateOrder(order._id, o, () => {
            handleAlert(true, AlertType.SUCCESS, "Update Order Status", `Order '${order._id}' status updated to ${OrderStatus[o.status]} successfully`);
            setShowAlert(true);
            loadOrders(pageControl.currPage);
        });
    }

    const handleDeleteOrder = async (orderId: string) => {
        ordersApi.withToken(appCtx.userData.authToken).delete(orderId)
            .then(result => {
                if (result && result.statusCode !== StatusCodes.NO_CONTENT) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                } else {
                    handleAlert(true, AlertType.WARNING, "Delete Order", `Order '${orderId}' deleted successfully`);
                }
                setShowAlert(true);
                getTotalPages();
                loadOrders(pageControl.currPage);
            })
    }

    const getTotalPages = useCallback(() => {
        ordersApi.withToken(appCtx.userData.authToken).count()
            .then(result => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                } else {
                    setPageControl({
                        currPage: 1,
                        totalPages: Math.ceil(result.count / DEFAULT_PAGE_SIZE)
                    });
                    setTotalPages(Math.ceil(result.count / DEFAULT_PAGE_SIZE));
                }
            });
    }, [handleAlert, appCtx.userData.authToken])

    const loadOrders = useCallback((page) => {
        if (!appCtx.userData.authToken) {
            setOrders([]);
            return;
        }

        setPageControl(prevState => ({
            ...prevState,
            currPage: page
        }));

        ordersApi.withToken(appCtx.userData.authToken).list(page)
            .then((result) => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                    setOrders([]);
                } else {
                    setOrders(result);
                }
            });
    },[handleAlert, appCtx.userData.authToken])

    useEffect(() => {
        getTotalPages();
        loadOrders(1);
    }, [getTotalPages, loadOrders])

    useEffect(() => {
        if (saved) {
            handleEditCancel();
        }
    }, [saved])

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
                                    onSaveSuccessful={handleSaveSuccessful}
                                    onCancel={handleEditCancel}/> :
                                <EditOrder
                                    id={edit.orderId}
                                    op={edit.op}
                                    onSaveSuccessful={handleSaveSuccessful}
                                    onCancel={handleEditCancel}/>}
                        </div>
                    </Modal>
                }
            </div>
        </>
    )
}