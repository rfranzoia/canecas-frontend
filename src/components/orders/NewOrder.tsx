import {Alert, Card, Col, Container, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useContext, useState} from "react";
import {useHistory} from "react-router-dom";
import {ordersApi} from "../../api/OrdersAPI";
import {ApplicationContext} from "../../context/ApplicationContext";
import {CustomButton} from "../ui/CustomButton";
import { Order } from "../../domain/Order";

export const NewOrder = () => {
    const appCtx = useContext(ApplicationContext);
    const history = useHistory();
    const [formData, setFormData] = useState({
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        items: []
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
        }, 3000)}
    };

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

    const handleSave = (event) => {
        event.preventDefault();
        const order: Order = {
            orderDate: new Date(formData.orderDate),
            userEmail: formData.userEmail,
            totalPrice: formData.totalPrice,
            items: formData.items
        }
        ordersApi.withToken(appCtx.userData.authToken).create(order)
            .then(result => {
                if (result._id) {
                    handleCancel();
                } else {
                    const error = result?.response?.data
                    appCtx.showErrorAlert(error.name, error.description);
                }
            })

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
                    {alert.show && (
                        <div>
                            <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible>
                                <Alert.Heading>{alert.title}</Alert.Heading>
                                <p>{alert.message}</p>
                            </Alert>
                        </div>
                    )}      
                </Col>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '46.5rem'}}>
                        <Card.Header as="h3">New Order</Card.Header>
                        <Card.Body>
                            <form>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="userEmail">Customer Email</label>
                                                <input className="form-control" id="userEmail" name="userEmail" required type="text"
                                                       value={formData.userEmail} onChange={handleChange}/>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="orderDate">Date</label>
                                                <input className="form-control" id="orderDate" name="orderDate" required type="date"
                                                       value={formData.orderDate} onChange={handleChange}/>
                                            </div>

                                        </Col>
                                        <Col>
                                            <div className="form-group">
                                                <label htmlFor="totalPrice">Total Price</label>
                                                <input className="form-control" id="totalPrice" name="totalPrice" required type="number"
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
                                            <CustomButton caption="Save" type="save" onClick={handleSave}/>
                                            <span>&nbsp;</span>
                                            <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                                        </Col>
                                    </Row>

                                </Container>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}