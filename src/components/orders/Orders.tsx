import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { DEFAULT_PAGE_SIZE } from "../../api/axios";
import { ordersApi } from "../../api/OrdersAPI";
import { findNextOrderStatus, Order, OrderStatus } from "../../domain/Order";
import { User } from "../../domain/User";
import { OpType, RootState } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import Modal from "../ui/Modal";
import EditOrder from "./EditOrder";
import { NewOrderForm } from "./NewOrderForm";
import styles from "./orders.module.css"
import { OrdersList } from "./OrdersList";
import { OrdersFilter } from "./OrdersListFilter";

export interface WizardFormData {
    _id?: string,
    user?: User,
    product?: string,
    price?: number,
    caricatures?: number,
    caricatureImages?: string,
    caricatureImagesFile?: object,
    background?: string,
    backgroundDescription?: string,
    backgroundImage?: string,
    backgroundImageFile?: object,
    amount?: number,
}

export const Orders = () => {
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [saved, setSaved] = useState(false);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: 0
    });
    const [edit, setEdit] = useState({
        show: false,
        op: OpType.VIEW,
        orderId: ""
    })

    const loadOrders = useCallback((page: number, filter?: string) => {
        if (!loggedUser.authToken) {
            setOrders([]);
            return;
        }

        setPageControl(prevState => ({
            ...prevState,
            currPage: page
        }));

        ordersApi.withToken(loggedUser.authToken).listByFilter(page, filter)
            .then((result) => {
                if (result.statusCode === StatusCodes.UNAUTHORIZED) {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: result.description
                    }));
                    history.replace("/");
                } else if (result.statusCode !== StatusCodes.OK) {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: result.description
                    }));
                    setShowAlert(true);
                    setOrders([]);
                } else {
                    setOrders(result.data);
                }
            });
    }, [dispatch, history, loggedUser.authToken])

    const updateOrder = (orderId: string, order, callback) => {
        ordersApi.withToken(loggedUser.authToken).update(orderId, order)
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: result.description
                    }));
                    setShowAlert(true);
                } else {
                    callback();
                }
            });
        handleCloseEditModal();
    }

    const getTotalPages = useCallback(() => {
        ordersApi.withToken(loggedUser.authToken).count()
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: result.description
                    }));
                    setShowAlert(true);
                } else {
                    setPageControl({
                        currPage: 1,
                        totalPages: Math.ceil(result.data.count / DEFAULT_PAGE_SIZE)
                    });
                }
            });
    }, [dispatch, loggedUser.authToken])

    const handleEdit = (op: OpType, orderId: string) => {
        setShowAlert(false);
        setEdit({
            show: true,
            op: op,
            orderId: orderId
        });
    }

    const handleSave = (order: Order) => {
        if (edit.op === OpType.NEW) {
            ordersApi.withToken(loggedUser.authToken).create(order)
                .then(result => {
                    if (result.statusCode === StatusCodes.CREATED) {
                        dispatch(uiActions.handleAlert({ show: false }));
                        getTotalPages();
                        loadOrders(pageControl.currPage);
                        setSaved(true);
                    } else {
                        const error = result.data;
                        dispatch(uiActions.handleAlert({
                            show: true,
                            type: AlertType.DANGER,
                            title: error.name,
                            message: error.description
                        }));
                        setShowAlert(true);
                    }
                })
        } else if (edit.op === OpType.EDIT) {
            updateOrder(order._id, order, () => {
                dispatch(uiActions.handleAlert({ show: false }));
                loadOrders(pageControl.currPage);
                setSaved(true);
            })
        }

    }

    const handleCloseEditModal = () => {
        setEdit({
            show: false,
            op: OpType.VIEW,
            orderId: ""
        });
        setSaved(false);
    }

    const handleConfirmOrder = (orderId: string) => {
        const o = {
            status: OrderStatus.CONFIRMED_ORDER
        }
        updateOrder(orderId, o, () => {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.SUCCESS,
                title: "Update Order",
                message: `Order '${orderId}' is now CONFIRMED`
            }));
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
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.WARNING,
                title: "Cancel Order",
                message: `Order '${orderId}' has been CANCELED`
            }));
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
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.SUCCESS,
                title: "Update Order Status",
                message: `Order '${order._id}' status updated to ${OrderStatus[o.status]} successfully`
            }));
            setShowAlert(true);
            loadOrders(pageControl.currPage);
        });
    }

    const handleDeleteOrder = async (orderId: string) => {
        ordersApi.withToken(loggedUser.authToken).delete(orderId)
            .then(result => {
                if (result && result.statusCode !== StatusCodes.NO_CONTENT) {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: result.description
                    }));
                } else {
                    dispatch(uiActions.handleAlert({
                        show: true,
                        type: AlertType.WARNING,
                        title: "Delete Order",
                        message: `Order '${orderId}' has been successfully DELETED`
                    }));
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
    }, [pageControl.currPage, loadOrders])

    const handleFilterError = (errorMessage: string) => {
        dispatch(uiActions.handleAlert({
            show: true,
            type: AlertType.WARNING,
            title: "Filter Error",
            message: errorMessage
        }));
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
                <AlertToast showAlert={showAlert}/>
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
                {edit.show &&
                    <Modal
                        onClose={handleCloseEditModal}>
                        <div className={styles["edit-order-modal"]}>
                            {edit.op === OpType.NEW ?
                                <NewOrderForm
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