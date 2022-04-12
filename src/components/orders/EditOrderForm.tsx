import {Card, Col, Container, Modal, Row} from "react-bootstrap";
import {OrderItemsList} from "./items/OrderItemsList";
import {useContext, useEffect, useState} from "react";
import {StatusChangeList} from "./history/StatusChangeList";
import {CustomButton} from "../ui/CustomButton";
import { OrderStatus, orderStatusAsArray } from "../../domain/Order";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const EditOrderForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const order = props.order;
    const [showAlert, setShowAlert] = useState(false);
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
            appCtx.handleAlert(true, AlertType.DANGER, "Error de Validação", "O produto selecionado já está em uso");
            setShowAlert(true);
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
        if (!formData._id) return;
        if (!isDataValid()) return;
        const o = {
            _id: formData._id,
            orderDate: formData.orderDate.split("T"[0]),
            userEmail: formData.userEmail,
            items: formData.items
        }
        props.onSaveOrder(o);
    }

    const isDataValid = (): boolean => {
        const { userEmail, orderDate } = formData;

        if (userEmail.trim().length === 0 || orderDate.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", "A data do Pedido e o Email do cliente devem ser informados!");
            setShowAlert(true);
            return false;
        }
        try {
            const d = new Date(orderDate);
            const today = new Date();
            if (d.getDate().valueOf() > today.valueOf()) {
                appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", "A data do pedido não pode ser superior a Hoje");
                setShowAlert(true);
                return false;
            }
        } catch (error) {
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", `"A data do Pedido não é valida!\n${error.message}`);
            setShowAlert(true);
            return false;
        }

        return true;
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
        appCtx.handleAlert(false);
        setShowAlert(false);
    }

    const handleViewStatusHistory = () => {
        setShowStatusHistory(true);
    }

    const handleCloseViewStatusHistory = () => {
        setShowStatusHistory(false);
    }

    const viewOnly = props.op === "view";
    const lockChanges = order.status !== 0

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
    }, [order])

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

    if (!formData._id) return (<></>);

    return (
        <>
            {showAlert && <AlertToast/>}
            <Card border="dark" className="align-content-center" style={{width: '46.5rem'}}>
                <Card.Header as="h3">{`${props.title} Pedido`}</Card.Header>
                <Card.Body>
                    <form onSubmit={handleSave}>
                        <Container>
                            <Row>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="_id">Pedido #</label>
                                        <input className="form-control bigger-input"
                                               id="_id"
                                               name="_id"
                                               required
                                               type="text"
                                               value={formData._id}
                                               onChange={handleChange}
                                               disabled/>
                                    </div>
                                </Col>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="orderDate">Data</label>
                                        <input className="form-control bigger-input"
                                               id="orderDate"
                                               name="orderDate"
                                               required
                                               type="date"
                                               value={formData.orderDate}
                                               onChange={handleChange}
                                               disabled={viewOnly || lockChanges}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="userEmail">Email Cliente</label>
                                        <input className="form-control bigger-input"
                                               id="userEmail"
                                               name="userEmail"
                                               required
                                               type="text"
                                               value={formData.userEmail}
                                               onChange={handleChange}
                                               disabled={viewOnly || lockChanges}/>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="totalPrice">Valor Total</label>
                                        <input className="form-control bigger-input"
                                               id="totalPrice"
                                               name="totalPrice"
                                               required type="number"
                                               value={formData.totalPrice.toFixed(2)} onChange={handleChange}
                                               disabled/>
                                    </div>

                                </Col>
                                <Col>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="status">Status</label>
                                        <select className="form-select"
                                                id="status"
                                                name="status"
                                                required
                                                value={formData.status}
                                                onChange={handleChange}
                                                disabled>
                                            <option value="">--- Selecione ---</option>
                                            {orderStatusAsArray().map((status, idx) => {
                                                return (<option key={idx}
                                                                value={status}>{OrderStatus[status]}</option>);
                                            })}
                                        </select>
                                    </div>
                                </Col>
                            </Row>
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
                                                <CustomButton caption="Salvar" onClick={handleSave} type="save"/>
                                                <span>&nbsp;</span>
                                            </>
                                        )}
                                        <CustomButton caption={viewOnly ? "Fechar" : "Cancelar"} onClick={() => props.onCancel()} type="close"/>
                                        <span>&nbsp;</span>
                                        {(viewOnly && order.status > 0) &&
                                            <CustomButton caption="Atualizações de Status"
                                                          onClick={handleViewStatusHistory}
                                                          type="list"/>
                                        }
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Modal size="lg"
                                       show={showStatusHistory}
                                       onHide={handleCloseViewStatusHistory}
                                       backdrop="static"
                                       keyboard={true}
                                       centered>
                                    <StatusChangeList
                                        statusHistory={order.statusHistory}
                                        onClick={handleCloseViewStatusHistory}/>
                                </Modal>
                            </Row>
                        </Container>
                    </form>
                </Card.Body>
            </Card>
        </>
    );
}