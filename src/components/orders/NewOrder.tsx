import {Card, Col, Container, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {CustomButton} from "../ui/CustomButton";
import {evaluateTotalPrice, Order} from "../../domain/Order";
import {AlertToast} from "../ui/AlertToast";
import {Role} from "../../domain/User";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {OrdersContext} from "../../context/OrdersContext";

import styles from "./orders.module.css";

export const NewOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const ordersCtx = useContext(OrdersContext);
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        orderDate: "",
        userEmail: appCtx.userData.role === Role.ADMIN? "": appCtx.userData.userEmail,
        totalPrice: 0,
        items: []
    });
    const {handleAlert} = appCtx;
    
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
        if (!isValidData()) return;
        const orderItems = formData.items.map(i => (
            {
                product: i.product,
                drawings: i.drawings,
                drawingsImages: i.drawingsImages,
                background: i.background,
                backgroundImage: i.backgroundImage,
                price: +i.price,
                amount: i.amount,
            }
        ))
        const order: Order = {
            orderDate: new Date(formData.orderDate),
            userEmail: formData.userEmail,
            totalPrice: +formData.totalPrice,
            items: orderItems,
        }
        props.onSave(order);

    }

    const isValidData = (): boolean => {
        const { userEmail, orderDate, items } = formData;
        if (userEmail.trim().length === 0 || orderDate.trim().length === 0 ||
            items.length === 0) {
            handleAlert(true, AlertType.DANGER, "Validation Error!", "The customer email, order date and items must be provided");
            setShowAlert(true);
            return false;
        }
        return true;
    }

    const handleCancel = () => {
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

    const handleSelectUser = (user) => {
        setFormData(prevState => {
            return {
                ...prevState,
                userEmail: user
            }
        })
    }

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

    return (
        <>
            {showAlert && <AlertToast/>}
            <Card border="dark">
                <Card.Header as="h3">New Order</Card.Header>
                <Card.Body>
                    <form>
                        <Container>
                            <Row>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="userEmail">Customer Email
                                            <span aria-hidden="true" className="required">*</span>
                                        </label>
                                        <AutoCompleteInput
                                            data={ordersCtx.users}
                                            value={formData.userEmail}
                                            displayFields="email,name"
                                            onFieldSelected={handleSelectUser}
                                            className={styles["custom-autocomplete"]}
                                            required
                                            placeholder="Enter a user Email/Name"/>
                                        <small>If you don't see all available emails try scrolling down the list</small>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="orderDate">Date<span aria-hidden="true"
                                                                             className="required">*</span></label>
                                        <input className="form-control bigger-input" id="orderDate" name="orderDate" required type="date"
                                               value={formData.orderDate} onChange={handleChange}/>
                                    </div>

                                </Col>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="totalPrice">Total Price</label>
                                        <input className="form-control bigger-input" id="totalPrice" name="totalPrice" required type="number"
                                               style={{textAlign: "right"}}
                                               value={formData.totalPrice.toFixed(2)} onChange={handleChange} disabled/>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <OrderItemsList items={formData.items}
                                                    viewOnly={false}
                                                    onItemRemove={handleItemRemove}
                                                    onItemAdd={handleItemAdd}/>
                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)
            </p>
            <div className="actions">
                <CustomButton caption="Save" type="save" onClick={handleSave}/>
                <span>&nbsp;</span>
                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
            </div>
        </>
    );
}