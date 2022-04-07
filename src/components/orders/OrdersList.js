import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {ordersApi} from "../../api/OrdersAPI";
import {OrderRow} from "./OrderRow";
import {getNextOrderStatus, OrderStatus} from "./Orders";

export const OrdersList = (props) => {
    const appCtx = useContext(ApplicationContext);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleOnDelete = async (order) => {
        if (await ordersApi.withToken(appCtx.userData.authToken).delete(order._id)) {
            props.onDelete(true, `Order '${order._id}' deleted successfully`);
        } else {
            props.onDelete(false);
        }
    }

    const handleOnForward = async (order) => {
        const o = {
            status: OrderStatus[getNextOrderStatus(order.status)].id
        }
        ordersApi.update(order._id, o)
            .then((o) => {
                if (o) {
                    props.onForward(true, `Order '${order._id}' status updated successfully`)
                }
            });
    }

    const handleOnCreate = (order) => {
        const o = {
            status: 1
        }
        ordersApi.update(order._id, o)
            .then((o) => {
                if (o) {
                    props.onConfirm(true, `Order '${order._id}' updated successfully`)
                }
            });
    }

    return (
        <Table striped bordered hover size="sm">
            <thead>
            <tr>
                <th width="7%">Order #</th>
                <th width="10%">Date</th>
                <th width="20%">Customer</th>
                <th width="10%">Total Price</th>
                <th width="10%">Status</th>
                <th width="15%">&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.orders.length > 0 && props.orders.map(order => (
                <OrderRow key={order._id} order={order}
                          onEdit={handleOnEdit}
                          onCreate={handleOnCreate}
                          onDelete={handleOnDelete}
                          onForward={handleOnForward}/>
            ))}
            </tbody>
        </Table>
    )
}