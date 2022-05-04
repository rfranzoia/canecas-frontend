import { FC, memo, useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { evaluateTotalPrice, Order, OrderStatus, orderStatusAsArray } from "../../domain/Order";
import useUsersApi from "../../hooks/useUsersApi";
import { OpType } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { AlertToast } from "../ui/AlertToast";
import { AutoCompleteInput } from "../ui/AutoCompleteInput";
import { BorderedRow } from "../ui/BorderedRow";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";
import { StatusChangeList } from "./history/StatusChangeList";
import { OrderItemsList } from "./items/OrderItemsList";
import { OrderItemWizard } from "./items/OrderItemWizard";
import styles from "./orders.module.css";

interface EditOrderFormProps {
    order: Order,
    op: OpType,
    title: string,
    onSaveOrder: Function,
    onCancel: Function,
}

const EditOrderForm: FC<EditOrderFormProps> = (props) => {
    const dispatch = useDispatch();
    const { users } = useUsersApi();
    const order = props.order;
    const [showAlert, setShowAlert] = useState(false);
    const [showWizardModal, setShowWizardModal] = useState(false);
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

    const handleSave = () => {
        if (!formData._id) return;
        if (!isDataValid()) return;
        const o = {
            _id: formData._id,
            orderDate: formData.orderDate.split("T")[0],
            userEmail: formData.userEmail,
            items: formData.items
        }
        props.onSaveOrder(o);
    }

    const isDataValid = (): boolean => {
        const { userEmail, orderDate } = formData;

        if (userEmail.trim().length === 0 || orderDate.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "Order Date and Customer Email must be provided!"
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
                message: `"Order Date is not valid!\n${error.message}`
            }));
            setShowAlert(true);
            return false;
        }

        return true;
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

    const handleShowWizardModal = () => {
        setShowAlert(false);
        setShowWizardModal(true);
    }

    const handleCloseWizardModal = () => {
        setShowAlert(false);
        setShowWizardModal(false);
    }

    const handleViewStatusHistory = () => {
        setShowStatusHistory(true);
    }

    const handleCloseViewStatusHistory = () => {
        setShowStatusHistory(false);
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
        setFormData({
            _id: order._id,
            orderDate: order.orderDate,
            userEmail: order.userEmail,
            totalPrice: order.totalPrice,
            status: order.status,
            items: order.items,
            statusHistory: order.statusHistory
        });
        setShowAlert(false);
    }, [order])

    const viewOnly = props.op === "view";
    const lockChanges = order.status !== 0

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            {showWizardModal &&
                <Modal
                    onClose={handleCloseWizardModal}>
                    <OrderItemWizard onCancel={handleCloseWizardModal} onItemAdd={handleItemAdd}/>
                </Modal>
            }
            <Card border="dark" className="align-content-center">
                <Card.Header as="h3">{`${props.title} Order`}</Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSave}>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label htmlFor="_id">ID #</label>
                                        <input className={styles["fancy-input"]}
                                               id="_id"
                                               name="_id"
                                               required
                                               type="text"
                                               value={formData._id} onChange={handleChange} disabled/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label htmlFor="orderDate">Date
                                            <span aria-hidden="true" className="required">*</span>
                                        </label>
                                        <input className={styles["fancy-input"]}
                                               id="orderDate"
                                               name="orderDate"
                                               required
                                               type="date"
                                               value={formData.orderDate}
                                               onChange={handleChange}
                                               disabled={viewOnly || lockChanges}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
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
                                            disabled={viewOnly}
                                            placeholder="Please select an user email"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label htmlFor="totalPrice">Total Price</label>
                                        <input className={styles["fancy-input"]}
                                               id="totalPrice"
                                               name="totalPrice"
                                               required type="number"
                                               value={formData.totalPrice.toFixed(2)} onChange={handleChange}
                                               disabled/>
                                    </Form.Group>

                                </Col>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label htmlFor="status">Status</label>
                                        <select className={styles["fancy-input"]}
                                                id="status"
                                                name="status"
                                                required
                                                value={formData.status}
                                                onChange={handleChange} disabled>
                                            <option value="">Please Select</option>
                                            {orderStatusAsArray().map((status, idx) => {
                                                return (<option key={idx}
                                                                value={status}>{OrderStatus[status]}</option>);
                                            })}
                                        </select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <br/>
                            <BorderedRow required title={"Items"}>
                                <Col>
                                    <OrderItemsList items={formData.items}
                                                    viewOnly={viewOnly}
                                                    onItemRemove={handleItemRemove}
                                                    onItemAdd={handleItemAdd}/>
                                    {!viewOnly &&
                                        <div>
                                            <hr/>
                                            {
                                                getActionIcon(ActionIconType.ADD_ITEM,
                                                    "Add Item",
                                                    !viewOnly,
                                                    () => handleShowWizardModal())
                                            }

                                        </div>
                                    }
                                </Col>
                            </BorderedRow>
                        </Container>
                    </Form>
                </Card.Body>
            </Card>
            {!viewOnly &&
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            }
            <div className="actions">
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                {(viewOnly && order.status > 0) &&
                    <CustomButton caption="Status Changes"
                                  onClick={handleViewStatusHistory}
                                  type="list"/>
                }
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={() => props.onCancel()} type="close"/>
            </div>
            {showStatusHistory &&
                <Modal onClose={handleCloseViewStatusHistory}>
                    <StatusChangeList statusHistory={order.statusHistory} onClick={handleCloseViewStatusHistory}/>
                </Modal>
            }
        </>
    );
}

export default memo(EditOrderForm);