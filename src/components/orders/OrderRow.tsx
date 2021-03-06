import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { findNextOrderStatus, OrderStatus } from "../../domain/Order";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { ConfirmModal } from "../ui/ConfirmModal";
import { OrderItems } from "./OrderItems";
import classes from "./orders.module.css";

export const OrderRow = (props) => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [order, setOrder] = useState({
        _id: "",
        orderDate: "",
        userEmail: "",
        status: 0,
        statusReason: "",
        totalPrice: 0,
        items: [],
        statusHistory: []
    });
    const [showItems, setShowItems] = useState(false);
    const [updateReason, setUpdateReason] = useState("");
    const [confirmationDialog, setConfirmationDialog] = useState({
            show: false,
            title: "",
            message: "",
            hasData: false,
            op: "",
            onConfirm: (param: string) => undefined,
            onCancel: () => undefined
        }
    );

    const handleClickMaster = () => {
        setShowItems(!showItems);
    }

    const handleEditOrder = (orderId: string) => {
        props.onEditOrder("edit", orderId);
    }

    const handleViewOrder = (orderId: string) => {
        props.onEditOrder("view", orderId);
    }

    const handleCloseDialog = () => {
        setConfirmationDialog({
            show: false,
            title: "",
            message: "",
            hasData: false,
            op: "",
            onConfirm: () => undefined,
            onCancel: () => undefined
        });
    }

    const handleMoveForward = () => {
        setConfirmationDialog({
            show: true,
            title: "Update Status",
            message: `Are you sure you want to update status of the order '${order._id}
                        from ${OrderStatus[order.status]} to ${OrderStatus[findNextOrderStatus(order.status)]}'?`,
            hasData: true,
            op: "update",
            onConfirm: (param) => handleConfirmForward(param),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleChangeReason = (event) => {
        setUpdateReason(event.target.value);
        setOrder(prevStatus => {
            return {
                ...prevStatus,
                statusReason: updateReason
            }
        })
    }

    const handleDeleteOrCancel = () => {
        if (order.status === OrderStatus.QUOTE_REQUEST) {
            setConfirmationDialog({
                show: true,
                title: "Delete Order",
                message: `Are you sure you want to delete the order '${order._id}'?`,
                op: "delete",
                hasData: false,
                onConfirm: () => handleConfirmDelete(),
                onCancel: () => handleCloseDialog()
            });
        } else {
            setConfirmationDialog({
                show: true,
                title: "Cancel Order",
                message: `Are you sure you want to CANCEL the order # '${order._id}'?,
                            this action cannot be undone`,
                hasData: true,
                op: "cancel",
                onConfirm: (param) => handleConfirmCancel(param),
                onCancel: () => handleCloseDialog()
            });
        }

    }

    const handleConfirmOrderDialog = () => {
        setConfirmationDialog({
            show: true,
            title: "Confirm Order",
            message: `Are you sure you want to confirm the order # '${order._id}', 
                           you wont be able to make changes after that?`,
            hasData: false,
            op: "confirm",
            onConfirm: () => handleConfirmCreate(),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleConfirmDelete = () => {
        props.onDelete(order._id);
        handleCloseDialog();
    }

    const handleConfirmCreate = () => {
        props.onConfirm(order._id);
        handleCloseDialog();
    }
    const handleConfirmForward = (updateReason) => {
        props.onForwardOrder(order, updateReason);
        handleCloseDialog();
    }
    const handleConfirmCancel = (cancelReason) => {
        props.onCancelOrder(order._id, cancelReason);
        handleCloseDialog();
    }

    const canCancelOrder =
        (user.role === Role.ADMIN && order.status > OrderStatus.QUOTE_REQUEST && order.status < OrderStatus.FINISHED) ||
        (order.status === OrderStatus.QUOTE_REQUEST || order.status === OrderStatus.CONFIRMED_ORDER);

    const actions =
        <td width="15%" align="right">
            {(user.role === Role.ADMIN || order.userEmail === user.email) &&
                getActionIcon(ActionIconType.EDIT,
                    "Edit Order",
                    order.status === OrderStatus.QUOTE_REQUEST,
                    () => handleEditOrder(order._id))
            }
            {(user.role === Role.ADMIN || order.userEmail === user.email) &&
                getActionIcon(order.status === OrderStatus.QUOTE_REQUEST ?
                        ActionIconType.DELETE :
                        ActionIconType.CANCEL_ITEM,
                    order.status === OrderStatus.QUOTE_REQUEST ? "Delete Order" : "Cancel Order",
                    canCancelOrder,
                    () => handleDeleteOrCancel())
            }
            {(user.role === Role.ADMIN || order.userEmail === user.email) &&
                getActionIcon(ActionIconType.USER_CHECK,
                    "Confirm Order",
                    order.status === OrderStatus.QUOTE_REQUEST,
                    () => handleConfirmOrderDialog())}
            {user.role === Role.ADMIN &&
                getActionIcon(ActionIconType.ACTION_FORWARD,
                    `Move Order to next Status (${OrderStatus[findNextOrderStatus(order.status)]})`,
                    (order.status !== OrderStatus.QUOTE_REQUEST && order.status < OrderStatus.FINISHED),
                    () => handleMoveForward())}
        </td>

    useEffect(() => {
        setOrder(props.order);
    }, [props.order]);

    return (
        <div className={classes.card}>
            <table width="100%">
                <tbody>
                <tr>
                    <td width="1%">
                        {!showItems ?
                            getActionIcon(ActionIconType.EXPAND, "Expand", true, () => handleClickMaster()) :
                            getActionIcon(ActionIconType.COLLAPSE, "Collapse", true, () => handleClickMaster())
                        }
                    </td>
                    <td width="15%">
                            <span style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => handleViewOrder(order._id)}>
                                Order#: {order._id}
                            </span>
                    </td>
                    <td width="12%" align="center">Date: {order.orderDate.split("T")[0]}</td>
                    <td width="20%">Customer: {order.userEmail}</td>
                    <td width="15%">Status: {OrderStatus[order.status]}</td>
                    <td width="8%" align="right">Total: {order.totalPrice.toFixed(2)}</td>
                    {user.role === Role.ADMIN && actions}
                </tr>
                </tbody>
            </table>
            {showItems && (
                <OrderItems items={order.items}/>
            )}
            {(confirmationDialog.op === "cancel" || confirmationDialog.op === "update") && (
                <ConfirmModal show={confirmationDialog.show} handleClose={confirmationDialog.onCancel}
                              handleConfirm={() => confirmationDialog.onConfirm(updateReason)}
                              hasData={confirmationDialog.hasData}>
                    <form>
                        <p>{confirmationDialog.message}</p>
                        <div className="form-group spaced-form-group">
                            <label>Reason</label>
                            <input className="form-control" value={updateReason} onChange={handleChangeReason}/>
                        </div>
                    </form>
                </ConfirmModal>
            )}
            {(confirmationDialog.op !== "cancel" && confirmationDialog.op !== "update") && (
                <ConfirmModal
                    show={confirmationDialog.show}
                    handleClose={confirmationDialog.onCancel}
                    handleConfirm={confirmationDialog.onConfirm}
                    title={confirmationDialog.title}
                    message={confirmationDialog.message}/>
            )}
        </div>
    )
}