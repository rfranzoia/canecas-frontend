import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { CustomButton } from "../ui/CustomButton";
import { CustomPagination } from "../ui/CustomPagination";
import { OrderRow } from "./OrderRow";
import classes from "./orders.module.css";
import OrdersListFilter from "./OrdersListFilter";

export const OrdersList = (props) => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [orders, setOrders] = useState([]);
    const [pageControl, setPageControl] = useState({
        totalPages: 0,
    });

    const handleEditOrder = (op: string, orderId: string) => {
        props.onEditOrder(op, orderId);
    }

    const handleConfirmOrder = (orderId: string) => {
        props.onConfirmOrder(orderId);
    }

    const handleForwardOrder = (order, forwardReason: string) => {
        props.onForwardOrder(order, forwardReason);
    }

    const handleCancelOrder = (orderId: string, cancelReason: string) => {
        props.onCancelOrder(orderId, cancelReason);
    }

    const handleDeleteOrder = (orderId: string) => {
        props.onDeleteOrder(orderId);
    }

    const handlePageChange = (currPage) => {
        props.loadOrders(currPage);
    }

    useEffect(() => {
        setOrders(props.orders);
    }, [props.orders]);

    useEffect(() => {
        setPageControl(prevState => {
            return {
                ...prevState,
                totalPages: props.totalPages
            }
        })
    }, [props.totalPages])

    return (
        <>
            <Card border="dark">
                <Card.Header as="h3">Orders</Card.Header>
                <Card.Body>
                    {user.role === Role.ADMIN &&
                        <div className="two-items-container">
                            <CustomButton
                                caption="New Order"
                                type="new"
                                customClass="fa fa-file-invoice"
                                onClick={() => handleEditOrder("new", "")}
                            />
                            <CustomPagination totalPages={pageControl.totalPages} onPageChange={handlePageChange}
                                              currPage={1}/>
                        </div>
                    }
                    <OrdersListFilter onFilterChange={props.onFilterChange} onFilterError={props.onFilterError}/>
                    {orders.length > 0 && orders.map(order => {
                        return (
                            <OrderRow key={order._id}
                                      order={order}
                                      onEditOrder={handleEditOrder}
                                      onDelete={handleDeleteOrder}
                                      onCancelOrder={handleCancelOrder}
                                      onConfirm={handleConfirmOrder}
                                      onForwardOrder={handleForwardOrder}/>
                        );
                    })}
                    {orders.length === 0 &&
                        <div className={classes.card}>
                            No orders were found!
                        </div>
                    }
                </Card.Body>
            </Card>
            <br/>
            <br/>
        </>
    );
}