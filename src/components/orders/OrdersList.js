import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../store/application-context";
import {ordersApi} from "../../api/OrdersAPI";
import {OrderRow} from "./OrderRow";

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
                <OrderRow key={order._id} order={order} onEdit={handleOnEdit} onCreate={handleOnCreate} onDelete={handleOnDelete}/>
            ))}
            </tbody>
        </Table>
    )
}