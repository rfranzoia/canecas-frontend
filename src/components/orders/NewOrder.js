import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useContext, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import {ordersApi} from "../../api/OrdersAPI";
import {ApplicationContext} from "../../context/ApplicationContext";
import {InformationToast} from "../ui/InformationToast";
import {BsExclamationTriangle} from "react-icons/all";

export const NewOrder = () => {
    const appCtx = useContext(ApplicationContext);
    const history = useHistory();
    const [formData, setFormData] = useState({
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        items: []
    });
    const [toast, setToast] = useState({
        show: false,
        onClose: () => undefined,
        title: "",
        message: "",
        when: "",
        icon: undefined
    });

    const orderDateRef = useRef();
    const userEmailRef = useRef();
    const totalPriceRef = useRef();

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

    const handleSave = () => {
        const order = {
            orderDate: orderDateRef.current.value,
            userEmail: userEmailRef.current.value,
            totalPrice: totalPriceRef.current.value,
            items: formData.items
        }
        ordersApi.withToken(appCtx.userData.authToken).create(order)
            .then(o => {
                if (o._id) {
                    handleCloseToast();
                    history.goBack();
                } else {
                    const error = o?.response?.data
                    setToast({
                        show: true,
                        onClose: () => handleCloseToast(),
                        title: "Create Order",
                        message: error.description,
                        when: error.name
                    })
                }
            })

    }

    const handleCloseToast = () => {
        setToast({
            show: false,
            onClose: () => undefined,
            title: "",
            message: "",
            when: ""
        });
    }

    const handleCancel = () => {
        history.goBack();
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

    return (
        <Container fluid style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <Row>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '46.5rem'}}>
                        <Card.Header as="h3">New Order</Card.Header>
                        <Card.Body>
                            <form onSubmit={handleSave}>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="userEmail">Customer Email</label>
                                                <input className="form-control" id="userEmail" name="userEmail" required type="text"
                                                       ref={userEmailRef}
                                                       value={formData.userEmail} onChange={handleChange}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="orderDate">Date</label>
                                                <input className="form-control" id="orderDate" name="orderDate" required type="date"
                                                       ref={orderDateRef} value={formData.orderDate} onChange={handleChange}/>
                                            </div>

                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="totalPrice">Total Price</label>
                                                <input className="form-control" id="totalPrice" name="totalPrice" required type="number"
                                                       ref={totalPriceRef}
                                                       style={{textAlign: "right"}}
                                                       value={formData.totalPrice.toFixed(2)} onChange={handleChange} disabled/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            <OrderItemsList items={formData.items}
                                                            viewOnly={false}
                                                            onItemRemove={handleItemRemove}
                                                            onItemAdd={handleItemAdd}/>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row>
                                        <Col>
                                            <Button variant="primary" onClick={handleSave}>Save</Button>
                                            <span>&nbsp;</span>
                                            <Button variant="danger" onClick={handleCancel}>Cancel</Button>
                                        </Col>
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
                        when={toast.when}/>
                </Col>
            </Row>
        </Container>

    );
}