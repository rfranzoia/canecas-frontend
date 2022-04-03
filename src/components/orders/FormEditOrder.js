import {Button, Card, Col, Container, Modal, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useEffect, useRef, useState} from "react";
import {OrderStatus} from "./Orders";
import {InformationToast} from "../ui/InformationToast";
import {BsExclamationTriangle} from "react-icons/all";
import {StatusChangeList} from "./history/StatusChangeList";

export const FormEditOrder = (props) => {
    const order = props.order;
    const [formData, setFormData] = useState({
        _id: "",
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        status: 0,
        items: [],
        statusHistory: []
    });

    const [showStatusHistory, setShowStatusHistory] = useState(false);

    const idRef = useRef();
    const orderDateRef = useRef();
    const userEmailRef = useRef();
    const totalPriceRef = useRef();
    const statusRef = useRef();

    const [toast, setToast] = useState({
        show: false,
        onClose: () => undefined,
        title: "",
        message: "",
        when: "",
        icon: undefined
    });

    useEffect(() => {
        setFormData({
            _id: order._id,
            orderDate: order.orderDate.split("T")[0],
            userEmail: order.userEmail,
            totalPrice: order.totalPrice,
            status: order.status,
            items: order.items,
            statusHistory: order.statusHistory
        });
    }, [order])

    const evaluateTotalPrice = (items) => {
        return items.reduce((acc, item) => {
            return acc + (item.price * item.amount);
        }, 0);
    }

    const handleItemRemove = (itemId) => {
        setFormData(prevState => {
            const items = prevState.items.filter(item => item._id !== itemId);
            const totalPrice = evaluateTotalPrice(items);
            return {
                ...prevState,
                items: items,
                totalPrice: totalPrice
            }
        });
    }

    const handleItemAdd = (item) => {
        const existingItem = formData.items.find((i) => i._id === item._id);
        if (existingItem) {
            setToast({
                show: true,
                onClose: () => handleCloseToast(),
                title: "Add Item",
                message: "The selected product is already on the list",
                when: "Item cannot be added!",
                icon: <BsExclamationTriangle color="orange"/>
            });
        } else {
            handleCloseToast();
            setFormData(prevState => {
                const items = [...prevState.items, item];
                const totalPrice = evaluateTotalPrice(items);
                return {
                    ...prevState,
                    items: items,
                    totalPrice: totalPrice
                };
            });
        }

    }

    const handleSave = (event) => {
        event.preventDefault();
        const o = {
            _id: order._id,
            orderDate: orderDateRef.current.value,
            userEmail: userEmailRef.current.value,
            items: formData.items
        }
        props.onSaveOrder(o);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleCloseToast = () => {
        setToast({
            show: false,
            onClose: () => undefined,
            title: "",
            message: "",
            when: "",
            icon: undefined
        });
    }

    const handleViewStatusHistory = () => {
        setShowStatusHistory(true);
    }

    const handleCloseViewStatusHistory = () => {
        setShowStatusHistory(false);
    }

    const viewOnly = props.op === "view";
    const lockChanges = order.status !== 0

    return (
        <Container style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <Row>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '46.5rem'}}>
                        <Card.Header as="h3">{`${props.title} Order`}</Card.Header>
                        <Card.Body>
                            <form onSubmit={handleSave}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="_id">ID #</label>
                                                <input className="form-control" id="_id" name="_id" required type="text"
                                                       ref={idRef}
                                                       value={formData._id} onChange={handleChange} disabled/>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="orderDate">Date</label>
                                                <input className="form-control" id="orderDate" name="orderDate" required
                                                       type="date"
                                                       ref={orderDateRef} value={formData.orderDate}
                                                       onChange={handleChange}
                                                       disabled={viewOnly || lockChanges}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="userEmail">Customer Email</label>
                                                <input className="form-control" id="userEmail" name="userEmail" required
                                                       type="text"
                                                       ref={userEmailRef}
                                                       value={formData.userEmail} onChange={handleChange}
                                                       disabled={viewOnly || lockChanges}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="totalPrice">Total Price</label>
                                                <input className="form-control" id="totalPrice" name="totalPrice"
                                                       required type="number"
                                                       ref={totalPriceRef}
                                                       style={{textAlign: "right"}}
                                                       value={formData.totalPrice.toFixed(2)} onChange={handleChange}
                                                       disabled/>
                                            </div>

                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="status">Status</label>
                                                <select className="form-select" id="status" name="status" required
                                                        ref={statusRef}
                                                        value={formData.status}
                                                        onChange={handleChange} disabled>
                                                    <option value="">Please Select</option>
                                                    {OrderStatus.map(status => {
                                                        return (<option key={status.id}
                                                                        value={status.id}>{status.value}</option>);
                                                    })}
                                                </select>
                                            </div>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            <OrderItemsList items={formData.items}
                                                            viewOnly={viewOnly}
                                                            onItemRemove={handleItemRemove}
                                                            onItemAdd={handleItemAdd}/>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            <div className="align-content-end">
                                                {!viewOnly && (
                                                    <>
                                                        <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
                                                        <span>&nbsp;</span>
                                                    </>
                                                )}
                                                <Button variant="danger" size="sm"
                                                        onClick={handleCancel}>{viewOnly ? "Close" : "Cancel"}</Button>
                                                <span>&nbsp;</span>
                                                {viewOnly &&
                                                    <Button variant="warning" size="sm"
                                                            onClick={handleViewStatusHistory}>Status Changes</Button>
                                                }
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Modal show={showStatusHistory} onHide={handleCloseViewStatusHistory} backdrop="static" keyboard={true} centered>
                                            <StatusChangeList statusHistory={order.statusHistory}/>
                                            <div style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                                                <Button variant="danger" size="sm"  onClick={handleCloseViewStatusHistory}>Close</Button>
                                            </div>
                                        </Modal>
                                    </Row>
                                </Container>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <InformationToast
                        show={toast.show}
                        onClose={toast.onClose}
                        title={toast.title}
                        message={toast.message}
                        when={toast.when}
                        icon={toast.icon}/>
                </Col>
            </Row>
        </Container>
    );
}