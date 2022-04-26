import {useCallback, useContext, useEffect, useState} from "react";
import {StatusCodes} from "http-status-codes";
import {ordersApi} from "../../api/OrdersAPI";
import {DEFAULT_PAGE_SIZE} from "../../api/axios";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {OrdersList} from "./OrdersList";
import {OrdersFilter} from "./OrdersListFilter";
import {NewOrder} from "./NewOrder";
import EditOrder from "./EditOrder";
import {findNextOrderStatus, Order, OrderStatus} from "../../domain/Order";
import {User} from "../../domain/User";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";

import styles from "./orders.module.css"
import {useHistory} from "react-router-dom";

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
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
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

    const loadOrders = useCallback((page: number, filter?: string) => {
        if (!appCtx.userData.authToken) {
            setOrders([]);
            return;
        }

        setPageControl(prevState => ({
            ...prevState,
            currPage: page
        }));

        ordersApi.withToken(appCtx.userData.authToken).listByFilter(page, filter)
            .then((result) => {
                if (result.statusCode === StatusCodes.UNAUTHORIZED) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    history.replace("/");
                } else if (result.statusCode !== StatusCodes.OK) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                    setOrders([]);
                } else {
                    setOrders(result.data);
                }
            });
    },[handleAlert, appCtx.userData.authToken, history])

    const updateOrder = (orderId: string, order, callback) => {
        ordersApi.withToken(appCtx.userData.authToken).update(orderId, order)
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                } else {
                    callback();
                }
            });
        handleCloseEditModal();
    }

    const getTotalPages = useCallback(() => {
        ordersApi.withToken(appCtx.userData.authToken).count()
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                } else {
                    setPageControl({
                        currPage: 1,
                        totalPages: Math.ceil(result.data.count / DEFAULT_PAGE_SIZE)
                    });
                }
            });
    }, [handleAlert, appCtx.userData.authToken])

    const handleEdit = (op: string, orderId: string) => {
        setEdit({
            show: true,
            op: op,
            orderId: orderId
        });
    }

    const handleSave = (order: Order) => {
        if (edit.op === OpType.NEW) {
            ordersApi.withToken(appCtx.userData.authToken).create(order)
                .then(result => {
                    if (result.statusCode === StatusCodes.CREATED) {
                        handleAlert(false);
                        getTotalPages();
                        loadOrders(pageControl.currPage);
                        setSaved(true);
                    } else {
                        const error = result.data;
                        handleAlert(true, AlertType.DANGER, error.name, error.description);
                        setShowAlert(true);
                    }
                })
        } else if (edit.op === OpType.EDIT) {
            updateOrder(order._id, order, () => {
                handleAlert(false);
                loadOrders(pageControl.currPage);
                setSaved(true);
            })
        }

    }

    const handleCloseEditModal = () => {
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
            handleAlert(true, AlertType.SUCCESS, "Update Order", `Order '${orderId}' is now CONFIRMED`);
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
            handleAlert(true, AlertType.WARNING, "Cancel Order", `Order '${orderId}' has been CANCELED`);
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
                    handleAlert(true, AlertType.WARNING, "Delete Order", `Order '${orderId}' has been successfully DELETED`);
                }
                setShowAlert(true);
                getTotalPages();
                loadOrders(pageControl.currPage);
            })
    }

    const handleFilterChange = useCallback((filter?: OrdersFilter) => {
        if (!filter) {
            loadOrders(pageControl.currPage);
            return;
        }
        let f = "";
        if (filter.startDate && filter.endDate) {
            f = f.concat(`startDate=${filter.startDate}&endDate=${filter.endDate}`);
        }
        if (filter.orderStatus) {
            if (f.trim().length > 0) {
                f = f.concat("&");
            }
            f = f.concat(`orderStatus=${filter.orderStatus}`);
        }
        if (filter.userEmail) {
            if (f.trim().length > 0) {
                f = f.concat("&");
            }
            f = f.concat(`userEmail=${filter.userEmail}`);
        }
        f = "?".concat(f);
        loadOrders(1, f);
    },[pageControl.currPage, loadOrders])

    const handleFilterError = (errorMessage: string) => {
        handleAlert(true, AlertType.WARNING, "Filter Error", errorMessage);
        setShowAlert(true);
    }

    useEffect(() => {
        getTotalPages();
        loadOrders(1);
    }, [getTotalPages, loadOrders])

    useEffect(() => {
        if (saved) {
            handleCloseEditModal();
        }
    }, [saved])

    return (
        <>
            <div>
                {showAlert && <AlertToast/> }
                <OrdersList
                    orders={orders}
                    totalPages={pageControl.totalPages}
                    loadOrders={loadOrders}
                    onEditOrder={handleEdit}
                    onDeleteOrder={handleDeleteOrder}
                    onCancelOrder={handleCancelOrder}
                    onConfirmOrder={handleConfirmOrder}
                    onForwardOrder={handleForwardOrder}
                    onFilterChange={handleFilterChange}
                    onFitlerError={handleFilterError}
                />
            </div>
            <div>
                { edit.show &&
                    <Modal
                        onClose={handleCloseEditModal}>
                        <div className={styles["edit-order-modal"]}>
                            {edit.op === OpType.NEW ?
                                <NewOrder
                                    onSave={handleSave}
                                    onCancel={handleCloseEditModal}/> :
                                <EditOrder
                                    id={edit.orderId}
                                    op={edit.op}
                                    onSave={handleSave}
                                    onCancel={handleCloseEditModal}/>}
                        </div>
                    </Modal>
                }
            </div>
        </>
    )
}