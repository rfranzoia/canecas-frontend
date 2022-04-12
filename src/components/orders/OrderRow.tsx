import classes from "./Orders.module.css";
import {useContext, useEffect, useState} from "react";
import {findNextOrderStatus, OrderStatus} from "../../domain/Order";
import {ButtonAction, getActionIcon} from "../ui/Actions";
import {OrderItems} from "./OrderItems";
import {ApplicationContext} from "../../context/ApplicationContext";
import {Role} from "../../domain/User";
import {ConfirmModal} from "../ui/ConfirmModal";

export const OrderRow = (props) => {
    const appCtx = useContext(ApplicationContext);
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
            title: "Atualizar Status",
            message: `Você tem certeza que quer atualizar o status do Pedido '${order._id}
                        de ${OrderStatus[order.status]} para ${OrderStatus[findNextOrderStatus(order.status)]}'?`,
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
        if (order.status === OrderStatus.NEW) {
            setConfirmationDialog({
                show: true,
                title: "Apagar Pedido",
                message: `Você tem certeza que quer apagar o Pedido '${order._id}'?`,
                op: "delete",
                hasData: false,
                onConfirm: () => handleConfirmDelete(),
                onCancel: () => handleCloseDialog()
            });
        } else {
            setConfirmationDialog({
                show: true,
                title: "Cancelar Pedido",
                message: `Você tem certeza que quer CANCELAR o Pedido # '${order._id}'?,
                            esta ação não pode ser desfeita`,
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
            title: "Confirmar Pedido",
            message: `Você tem certeza que quer confirmar o Pedido # '${order._id}'? 
                           você não poderá mais modificá-lo após isso.`,
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
        (appCtx.userData.role === Role.ADMIN && order.status > OrderStatus.NEW && order.status < OrderStatus.FINISHED) ||
        (order.status === OrderStatus.NEW || order.status === OrderStatus.CONFIRMED);

    const actions =
            <td width="15%" align="right">
                {(appCtx.userData.role === Role.ADMIN || order.userEmail === appCtx.userData.userEmail) &&
                    getActionIcon(ButtonAction.EDIT,
                        "Editar Pedido",
                        order.status === OrderStatus.NEW,
                        () => handleEditOrder(order._id))
                }
                <span>&nbsp;</span>
                {(appCtx.userData.role === Role.ADMIN || order.userEmail === appCtx.userData.userEmail) &&
                        getActionIcon(order.status === OrderStatus.NEW?
                                ButtonAction.DELETE:
                                ButtonAction.CANCEL_ITEM,
                            order.status === OrderStatus.NEW?"Apagar Pedido":"Cancelar Pedido",
                            canCancelOrder,
                            () => handleDeleteOrCancel())
                }
                <span>&nbsp;</span>
                {(appCtx.userData.role === Role.ADMIN || order.userEmail === appCtx.userData.userEmail) &&
                    getActionIcon(ButtonAction.USER_CHECK,
                    "Confirmar Pedido",
                    order.status === OrderStatus.NEW,
                    () => handleConfirmOrderDialog())}
                <span>&nbsp;</span>
                {appCtx.userData.role === Role.ADMIN &&
                    getActionIcon(ButtonAction.ACTION_FORWARD,
                    `Mover para próximo Status do Pedido (${OrderStatus[findNextOrderStatus(order.status)]})`,
                    (order.status !== OrderStatus.NEW && order.status < OrderStatus.FINISHED),
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
                            getActionIcon(ButtonAction.EXPAND, "Expandir", false, () => handleClickMaster()) :
                            getActionIcon(ButtonAction.COLLAPSE, "Reduzir", false, () => handleClickMaster())
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
                <OrderItems items={order.items}/>
            )}
            {(confirmationDialog.op === "cancel" || confirmationDialog.op === "update") && (
                <ConfirmModal show={confirmationDialog.show} handleClose={confirmationDialog.onCancel}
                    handleConfirm={() => confirmationDialog.onConfirm(updateReason)} hasData={confirmationDialog.hasData}>
                    <form>
                        <p>{confirmationDialog.message}</p>
                        <div className="form-group spaced-form-group">
                            <label>Reason</label>
                            <input className="form-control" value={updateReason} onChange={handleChangeReason} />
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