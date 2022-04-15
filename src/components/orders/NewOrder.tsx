import {Card, Col, Container, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useContext, useEffect, useState} from "react";
import {ordersApi} from "../../api/OrdersAPI";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {CustomButton} from "../ui/CustomButton";
import { Order } from "../../domain/Order";
import {AlertToast} from "../ui/AlertToast";
import {Role} from "../../domain/User";
import {usersApi} from "../../api/UsersAPI";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";

export const NewOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        orderDate: "",
        userEmail: appCtx.userData.role === Role.ADMIN? "": appCtx.userData.userEmail,
        totalPrice: 0,
        items: []
    });

    const handleItemRemove = (itemId) => {
        setFormData(prevState => {
            const items = prevState.items.filter(item => item._id !== itemId);
            const totalPrice = ordersApi.evaluateTotalPrice(items);
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
                const totalPrice = ordersApi.evaluateTotalPrice(items);
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
        const order: Order = {
            orderDate: new Date(formData.orderDate),
            userEmail: formData.userEmail,
            totalPrice: formData.totalPrice,
            items: formData.items
        }
        ordersApi.withToken(appCtx.userData.authToken).create(order)
            .then(result => {
                if (result._id) {
                    props.onSave();
                } else {
                    const error = result?.response?.data;
                    appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
                    setShowAlert(true);
                }
            })

    }

    const isValidData = (): boolean => {
        const { userEmail, orderDate, items } = formData;
        if (userEmail.trim().length === 0 || orderDate.trim().length === 0 ||
            items.length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "The customer email, order date and items must be provided");
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
                type: user
            }
        })
    }

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

    useEffect(() => {
        if (!appCtx.isLoggedIn()) return;
        usersApi.withToken(appCtx.userData.authToken).list()
            .then(result => {
                setUsers(result);
            })
    }, []);

    return (
        <Container fluid style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <Row>
                <Col>
                    {showAlert && <AlertToast/>}
                </Col>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '46.5rem'}}>
                        <Card.Header as="h3">New Order</Card.Header>
                        <Card.Body>
                            <form>
                                <Container>
                                    <Row>
                                        <Col>
                                            <div className="form-group spaced-form-group">
                                                <label htmlFor="userEmail">
                                                    Customer Email<span aria-hidden="true" className="required">*</span>
                                                </label>
                                                <AutoCompleteInput
                                                    data={users}
                                                    value={formData.userEmail}
                                                    displayFields="email,name"
                                                    onFieldSelected={handleSelectUser}
                                                    className="form-control bigger-input"
                                                    required
                                                    placeholder="Please select an user email"/>
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
                                    <br/>
                                    <Row>
                                        <Col>
                                            <CustomButton caption="Save" type="save" onClick={handleSave}/>
                                            <span>&nbsp;</span>
                                            <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                                            <p aria-hidden="true" id="required-description">
                                                <span aria-hidden="true" className="required">*</span>Required field(s)
                                            </p>
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