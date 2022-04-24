import {Card} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {OrderRow} from "./OrderRow";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {Role} from "../../domain/User";
import {CustomPagination} from "../ui/CustomPagination";

export const OrdersList = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [orders, setOrders] = useState([]);
    const [pageControl, setPageControl] = useState({
        currPage: 1,
        totalPages: 0
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
                    {appCtx.userData.role !== Role.GUEST &&
                        <div className="two-items-container">
                            <CustomButton
                                caption="New Order"
                                type="new"
                                customClass="fa fa-file-invoice"
                                onClick={() => handleEditOrder("new", "")}
                            />
                            <CustomPagination totalPages={pageControl.totalPages} onPageChange={handlePageChange} currPage={pageControl.currPage}/>
                        </div>
                    }
                    {orders.map(order => {
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
                </Card.Body>
            </Card>
            <br/>
            <br/>
        </>
    );
}