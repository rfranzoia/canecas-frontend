import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {BiEdit, BiFastForwardCircle, BiTrash, BiUserCheck} from "react-icons/all";
import {useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import { findNextOrderStatus, OrderStatus } from "../../domain/Order";

export const OrderRow = (props) => {
    const order = props.order;
    const [confirmationDialog, setConfirmationDialog] = useState({
            show: false,
            title: "",
            message: "",
            op: "",
            onConfirm: () => undefined,
            onCancel: () => undefined
        }
    );

    const handleMoveForward = () => {
        setConfirmationDialog({
            show: true,
            title: "Update Status",
            message: `Are you sure you want to update status of the order '${order._id}
                        from ${OrderStatus[order.status]} to ${OrderStatus[findNextOrderStatus(order.status)]}'?`,
            op: "update",
            onConfirm: () => handleConfirmForward(),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleDelete = () => {
        setConfirmationDialog({
            show: true,
            title: "Delete Order",
            message: `Are you sure you want to delete the order '${order._id}'?`,
            op: "delete",
            onConfirm: () => handleConfirmDelete(),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleConfirmOrderDialog = () => {
        setConfirmationDialog({
            show: true,
            title: "Confirm Order",
            message: `Are you sure you want to confirm the order # '${order._id}', 
                           you wont be able to make changes after that?`,
            op: "confirm",
            onConfirm: () => handleConfirmCreate(),
            onCancel: () => handleCloseDialog()
        });
    }

    const handleCloseDialog = () => {
        setConfirmationDialog({
            show: false,
            title: "",
            message: "",
            op: "",
            onConfirm: () => undefined,
            onCancel: () => undefined
        });
    }

    const handleConfirmDelete = () => {
        props.onDelete(order);
        handleCloseDialog();
    }

    const handleConfirmCreate = () => {
        props.onCreate(order);
        handleCloseDialog();
    }
    const handleConfirmForward = () => {
        props.onForward(order);
        handleCloseDialog();
    }

    const viewOrderTooltip = (props) => (
        <Tooltip id="view-order-tooltip" {...props}>
            Click to view this order details!
        </Tooltip>
    )

    return (
        <tr key={order._id} style={{ verticalAlign: "middle"}}>
            <td>
                <OverlayTrigger
                    delay={{show: 250, hide: 500}}
                    placement="top"
                    overlay={viewOrderTooltip}>
                    <span style={{cursor: "pointer", color: "blue"}}
                        onClick={() => props.onEdit("view", order._id)}>{order._id}</span>
                </OverlayTrigger>
            </td>
            <td>{order.orderDate.split("T")[0]}</td>
            <td>{order.userEmail}</td>
            <td align="right">{order.totalPrice.toFixed(2)}</td>
            <td>{OrderStatus[order.status]}</td>
            <td align="center">
                <BiEdit
                        onClick={() => props.onEdit("edit", order._id)}
                        style={order.status !== 0 && { pointerEvents: "none" }}
                        title="Edit Order"
                        size="2em"
                        cursor="pointer"
                        color={order.status !== 0?"#a2a0a0":"blue"}/>
                <span> | </span>
                <BiTrash
                    onClick={handleDelete}
                    style={order.status !== 0 && { pointerEvents: "none" }}
                    title="Delete Order"
                    size="2em"
                    cursor="pointer"
                    color={order.status !== 0?"#a2a0a0":"red"}/>
                <span> | </span>
                <BiUserCheck
                        onClick={handleConfirmOrderDialog}
                        style={order.status !== 0 && { pointerEvents: "none" }}
                        title="Confirm Order"
                        size="2em"
                        cursor="pointer"
                        color={order.status !== 0?"#a2a0a0":"green"}/>
                <span> | </span>
                <BiFastForwardCircle
                        onClick={handleMoveForward}
                        style={(order.status === 0 || order.status >= 8) && { pointerEvents: "none" }}
                        size="2em"
                        title={`Move Order to next Status (${OrderStatus[findNextOrderStatus(order.status)]})`}
                        cursor="pointer"
                        color={(order.status === 0 || order.status >= 8)?"#a2a0a0":"orange"}/>
            </td>
            <ConfirmModal
                show={confirmationDialog.show}
                handleClose={confirmationDialog.onCancel}
                handleConfirm={confirmationDialog.onConfirm}
                title={confirmationDialog.title}
                message={confirmationDialog.message}/>
        </tr>
    );
}