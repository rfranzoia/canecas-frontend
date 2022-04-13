import {Card, Pagination} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {OrderRow} from "./OrderRow";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {DEFAULT_AROUND, DEFAULT_BOUNDARIES} from "../../api/OrdersAPI";

export const OrdersList = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [orders, setOrders] = useState([]);
    const [pagination, setPagination] = useState(<></>);
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

    const createPagination = (currPage: number, totalPages: number, boundaries: number, around: number) => {
        const start = boundaries;
        const end = totalPages - boundaries + 1;
        const aroundBefore = currPage - around;
        const aroundAfter = currPage + around;

        let res: number[] = [];
        let printDot = false;

        const isTooShort = (end - start) <= 4;
        for (let page = 1; page <= totalPages; page++) {
            if (isTooShort) {
                res.push(page);

            } else if (page <= start || page >= end || page === currPage ||
                (page >= aroundBefore && page <= aroundAfter)) {
                res.push(page);
                printDot = true;

            } else if (printDot) {
                res.push(-1);
                printDot = false;
            }
        }

        return (
            <>
                <Pagination>
                    <Pagination.First onClick={handleFirstPage}/>
                    <Pagination.Prev onClick={handlePrevPage}/>
                    {res.map(p => {
                        return (
                            p !== -1 ?
                                <Pagination.Item key={p}
                                                 active={p === pageControl.currPage}
                                                 onClick={() => handleCurrPage(p)}>
                                    {p}
                                </Pagination.Item>:
                                <Pagination.Ellipsis key={p} disabled={true}/>
                        )
                    })}
                    <Pagination.Next onClick={handleNextPage}/>
                    <Pagination.Last onClick={handleLastPage}/>
                </Pagination>
            </>
        )
    }

    const handleCurrPage = (currPage: number) => {
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: currPage
            };
        });
    }

    const handleNextPage = () => {
        if (pageControl.currPage === pageControl.totalPages) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: prevState.currPage + 1
            };
        });
    }

    const handlePrevPage = () => {
        if (pageControl.currPage === 1) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: prevState.currPage - 1
            };
        });
    }

    const handleFirstPage = () => {
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: 1
            };
        });
    }

    const handleLastPage = () => {
        if (pageControl.currPage + 1 >= pageControl.totalPages) return;
        setPageControl(prevState => {
            return {
                ...prevState,
                currPage: prevState.totalPages
            };
        });
    }

    const loadOrders = () => {
        props.loadOrders(pageControl.currPage);
    }

    useEffect(() => {
        if (!appCtx.userData.authToken) {
            return;
        }
        loadOrders();
    }, [appCtx, pageControl.currPage]);

    useEffect(() => {
        setPagination(createPagination(pageControl.currPage, pageControl.totalPages, DEFAULT_BOUNDARIES, DEFAULT_AROUND));
    }, [pageControl])

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
            <Card border="dark" style={{margin: "1rem"}}>
                <Card.Header as="h3">Orders</Card.Header>
                <Card.Body>
                    <div>
                        <CustomButton
                            caption="New Order"
                            type="new"
                            customClass="fa fa-file-invoice"
                            onClick={() => handleEditOrder("new", "")}/>
                    </div>
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
            {pagination}
            <br/>
            <br/>
        </>
    );
}