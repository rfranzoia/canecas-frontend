import {CustomButton} from "../../ui/CustomButton";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../../context/ApplicationContext";
import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Image, Row} from "react-bootstrap";

export const OrderItemWizardAmount = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        product: "",
        productPrice: 0,
        drawings: 0,
        drawingsImage: "",
        drawingsImageFile: null,
        background: "empty",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
        amount: 0,
    });

    const handleChangeNumber = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, "")
            }
        });
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

    const handleAddItem = () => {
        const amount = {
            amount: formData.amount,
        }
        props.onFinish({amount: amount});
    }

    const handleBackward = () => {
        props.onBackward();
    }

    useEffect(() => {
        setFormData({
            product: props.orderItem.product,
            productPrice: props.orderItem.productPrice,
            drawings: props.orderItem.drawings,
            drawingsImage: props.orderItem.drawingsImage,
            drawingsImageFile: props.orderItem.drawingsImageFile,
            background: props.orderItem.background,
            backgroundDescription: props.orderItem.backgroundDescription,
            backgroundImage: props.orderItem.backgroundImage,
            backgroundImageFile: props.orderItem.backgroundImageFile,
            amount: props.orderItem.amount,
        });
    }, [props.orderItem])

    return (
        <>
            {appCtx.alert.show && <AlertToast/>}
            <Card className="order-item-wizard-card">
                <Card.Header>
                    Inform the final PRICE and AMOUNT
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Product</Form.Label>
                                    <Form.Control
                                        value={formData.product}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Label>Drawings</Form.Label>
                            <Col md="auto">
                                <div className="tinny-bordered-panel">
                                    {formData.drawingsImage &&
                                        <Image src={formData.drawingsImageFile}
                                               fluid width="100" title={formData.drawingsImage}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Select value={formData.drawings}
                                                 className="bigger-select"
                                                 disabled
                                                 onChange={handleChange}
                                                 name="drawings">
                                        <option value={0}>No drawings</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </Form.Select>
                                    <small>{formData.drawingsImage}</small>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Label>Background</Form.Label>
                            <Col md="auto">
                                <div className="tinny-bordered-panel">
                                    {formData.backgroundImage &&
                                        <Image src={formData.backgroundImageFile}
                                               fluid width="100" title={formData.backgroundImage}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Check type="radio"
                                                label="Empty"
                                                id="bgEmpty"
                                                name="background"
                                                value="empty"
                                                disabled
                                                checked={formData.background === "empty"}
                                                onChange={handleChange}/>
                                    <Form.Check type="radio"
                                                label="Personalized"
                                                id="bgPersonalized"
                                                name="background"
                                                value="personalized"
                                                disabled
                                                checked={formData.background === "personalized"}
                                                onChange={handleChange}/>
                                </Form.Group>
                                <Form.Group className="spaced-form-group">
                                    <label htmlFor="description">Tell us your idea</label>
                                    <textarea className="form-control bigger-input"
                                              id="description"
                                              name="backgroundDescription"
                                              rows={3}
                                              value={formData.backgroundDescription}
                                              disabled
                                              onChange={handleChange}/>
                                    <small>{formData.backgroundImage}</small>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Price<span aria-hidden="true" className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        required
                                        type="text"
                                        name="productPrice"
                                        value={formData.productPrice}
                                        onChange={handleChangeNumber}
                                        autoComplete="off"
                                        style={{textAlign: "right"}}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Amount<span aria-hidden="true"
                                                            className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        required
                                        type="text"
                                        name="amount"
                                        id="amount"
                                        value={formData.amount}
                                        onChange={handleChangeNumber}
                                        autoComplete="off"
                                        style={{textAlign: "right"}}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="actions action-justify-right  order-item-wizard-card">
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Previous"
                              type="custom-success"
                              customClass="fa fa-backward"
                              onClick={handleBackward}
                />
                <CustomButton caption="Add Item"
                              type="custom-primary"
                              customClass="fa fa-forward"
                              onClick={handleAddItem}
                />
            </div>
        </>
    );
}