import classes from "./MasterDetail.module.css";
import {useContext, useState} from "react";
import {findNextOrderStatus, OrderStatus} from "../../domain/Order";
import {ButtonAction, getActionIcon} from "./Actions";
import {Details} from "./Details";
import {ApplicationContext} from "../../context/ApplicationContext";
import {Role} from "../../domain/User";
import {ConfirmModal} from "../ui/ConfirmModal";

export const Master = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [order, setOrder] = useState(props.order);
    const [showItems, setShowItems] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [confirmationDialog, setConfirmationDialog] = useState({
            show: false,
            title: "",
            message: "",
            hasData: false,
            op: "",
            onConfirm: () => undefined,
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
            onConfirm: () => handleConfirmForward(),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleChangeReason = (event) => {
        setCancelReason(event.target.value);
        setOrder(prevStatus => {
            return {
                ...prevStatus,
                statusReason: cancelReason
            }
        })
    }

    const handleDeleteOrCancel = () => {
        if (order.status === OrderStatus.NEW) {
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
                message: "",
                hasData: true,
                op: "cancel",
                onConfirm: () => handleConfirmCancel(cancelReason),
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
    const handleConfirmForward = () => {
        props.onForward(order);
        handleCloseDialog();
    }
    const handleConfirmCancel = (param) => {
        console.log("master 125", param)
        props.onCancelOrder(order._id, param);
        handleCloseDialog();
    }


    const canCancelOrder =
        (appCtx.userData.role === Role.ADMIN && order.status > OrderStatus.NEW && order.status < OrderStatus.FINISHED) ||
        (order.status === OrderStatus.NEW || order.status === OrderStatus.CONFIRMED);

    const actions =
            <td width="15%" align="right">
                {(appCtx.userData.role === Role.ADMIN || order.userEmail == appCtx.userData.userEmail) &&
                    getActionIcon(ButtonAction.EDIT,
                        "Edit Order",
                        order.status === OrderStatus.NEW,
                        () => handleEditOrder(order._id))
                }
                <span>&nbsp;</span>
                {(appCtx.userData.role === Role.ADMIN || order.userEmail == appCtx.userData.userEmail) &&
                        getActionIcon(order.status === OrderStatus.NEW?
                                ButtonAction.DELETE:
                                ButtonAction.CANCEL_ITEM,
                            order.status === OrderStatus.NEW?"Delete Order":"Cancel Order",
                            canCancelOrder,
                            () => handleDeleteOrCancel())
                }
                <span>&nbsp;</span>
                {(appCtx.userData.role === Role.ADMIN || order.userEmail == appCtx.userData.userEmail) &&
                    getActionIcon(ButtonAction.USER_CHECK,
                    "Confirm Order",
                    order.status === OrderStatus.NEW,
                    () => handleConfirmOrderDialog())}
                <span>&nbsp;</span>
                {appCtx.userData.role === Role.ADMIN &&
                    getActionIcon(ButtonAction.ACTION_FORWARD,
                    `Move Order to next Status (${OrderStatus[findNextOrderStatus(order.status)]})`,
                    (order.status !== OrderStatus.NEW && order.status < OrderStatus.FINISHED),
                    () => handleMoveForward())}
            </td>

    return (
        <div className={classes.card}>
            <table width="100%">
                <tbody>
                <tr>
                    <td width="1%">
                        {!showItems ?
                            getActionIcon(ButtonAction.EXPAND, "Expand", false, () => handleClickMaster()) :
                            getActionIcon(ButtonAction.COLLAPSE, "Collapse", false, () => handleClickMaster())
                        }
                    </td>
                    <td width="15%">
                            <span style={{cursor: "pointer", color: "blue"}} onClick={() => handleViewOrder(order._id)}>
                                Order#: {order._id}
                            </span>
                    </td>
                    <td width="12%" align="center">Date: {order.orderDate.split("T")[0]}</td>
                    <td width="21%">Customer: {order.userEmail}</td>
                    <td width="16%">Status: {OrderStatus[order.status]}</td>
                    <td width="8%" align="right">Total: {order.totalPrice.toFixed(2)}</td>
                    {actions}
                </tr>
                </tbody>
            </table>
            {showItems && (
                <Details items={order.items}/>
            )}
            {confirmationDialog.op === "cancel" && (
                <ConfirmModal show={confirmationDialog.show} handleClose={confirmationDialog.onCancel}
                    handleConfirm={() => handleConfirmCancel(cancelReason)} hasData={confirmationDialog.hasData}>
                    <form>
                        <p>`Are you sure you want to CANCEL the order # '${order._id}'?,
                            this action cannot be undone`</p>
                        <div className="form-group">
                            <label>Reason</label>
                            <input className="form-control" value={cancelReason} onChange={handleChangeReason} />
                        </div>
                    </form>
                </ConfirmModal>
            )}
            {confirmationDialog.op !== "cancel" && (
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