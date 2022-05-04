import { FC, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { evaluateTotalPrice, Order } from "../../domain/Order";
import { Role, User } from "../../domain/User";
import useUsersApi from "../../hooks/useUsersApi";
import { RootState } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { AlertToast } from "../ui/AlertToast";
import { AutoCompleteInput } from "../ui/AutoCompleteInput";
import { BorderedRow } from "../ui/BorderedRow";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";
import { OrderItemsList } from "./items/OrderItemsList";
import { OrderItemWizard } from "./items/OrderItemWizard";

import styles from "./orders.module.css";

interface NewOrderProps {
    onSave: Function,
    onCancel: Function,
}

export const NewOrder: FC<NewOrderProps> = (props) => {
    const dispatch = useDispatch();
    const { users } = useUsersApi();
    const [showAlert, setShowAlert] = useState(false);
    const [showWizardModal, setShowWizardModal] = useState(false);
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [formData, setFormData] = useState({
        orderDate: "",
        userEmail: user.role === Role.ADMIN ? "" : user.email,
        totalPrice: 0,
        items: []
    });

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
        setShowWizardModal(false);
        const existingItem = formData.items.find((i) => i._id === item._id);
        if (existingItem) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "The selected product is already on the list"
            }));
            setShowAlert(true);
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
        if (!isDataValid()) return;
        const orderItems = formData.items.map(i => (
            {
                product: i.product,
                caricatures: i.caricatures,
                caricatureImages: i.caricatureImages,
                background: i.background,
                backgroundImage: i.backgroundImage,
                backgroundDescription: i.backgroundDescription,
                price: +i.price,
                amount: +i.amount,
            }
        ))
        const order: Order = {
            orderDate: formData.orderDate,
            userEmail: formData.userEmail,
            totalPrice: +formData.totalPrice,
            items: orderItems,
        }
        props.onSave(order);

    }

    const isDataValid = (): boolean => {
        const { userEmail, orderDate, items } = formData;

        if (userEmail.trim().length === 0 || orderDate.trim().length === 0 ||
            items.length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "The customer email, order date and items must be provided"
            }));
            setShowAlert(true);
            return false;
        }
        try {
            const d = new Date(orderDate);
            if (d.valueOf() > Date.now().valueOf()) {
                dispatch(uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: "Validation Error",
                    message: "Order Date cannot be after today"
                }));
                setShowAlert(true);
                return false;
            }
        } catch (error) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: `Order Date is not valid!\n${error.message}`
            }));
            setShowAlert(true);
            return false;
        }

        return true;
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
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

    const handleShowWizardModal = () => {
        setShowAlert(false);
        setShowWizardModal(true);
    }

    const handleCloseWizardModal = () => {
        setShowAlert(false);
        setShowWizardModal(false);
    }

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            {showWizardModal &&
                <Modal
                    onClose={handleCloseWizardModal}>
                    <OrderItemWizard onCancel={handleCloseWizardModal} onItemAdd={handleItemAdd}/>
                </Modal>
            }
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
                                            data={users}
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
                                        <input className={styles["fancy-input"]}
                                               id="orderDate"
                                               name="orderDate"
                                               required type="date"
                                               value={formData.orderDate} onChange={handleChange}/>
                                    </div>

                                </Col>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="totalPrice">Total Price</label>
                                        <input className={styles["fancy-input"]}
                                               id="totalPrice"
                                               name="totalPrice"
                                               required type="number"
                                               style={{ textAlign: "right" }}
                                               value={formData.totalPrice.toFixed(2)} onChange={handleChange} disabled/>
                                    </div>
                                </Col>
                            </Row>
                            <br/>
                            <BorderedRow required title={"Items"}>
                                <Col>
                                    {formData.items.length > 0 &&
                                        <OrderItemsList items={formData.items}
                                                        viewOnly={false}
                                                        onItemRemove={handleItemRemove}
                                                        onItemAdd={handleItemAdd}/>
                                    }
                                    <div>
                                        <hr/>
                                        {
                                            getActionIcon(ActionIconType.ADD_ITEM,
                                                "Add Item",
                                                true,
                                                () => handleShowWizardModal())
                                        }

                                    </div>
                                </Col>
                            </BorderedRow>
                        </Container>
                    </form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)
            </p>
            <div className="actions">
                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                <CustomButton caption="Save" type="save" onClick={handleSave}/>
            </div>
        </>
    );
}