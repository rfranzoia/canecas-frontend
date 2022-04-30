import { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AlertType, uiActions } from "../../../store/uiSlice";
import { AlertToast } from "../../ui/AlertToast";
import { BorderedRow } from "../../ui/BorderedRow";
import { CustomButton } from "../../ui/CustomButton";

export const OrderWizardAmount = (props) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);

    const [formData, setFormData] = useState({
        user: null,
        product: "",
        price: 0,
        drawings: 0,
        drawingsImages: "",
        drawingsImagesFile: null,
        background: "empty",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
        amount: 0,
    });

    const handleChangeNumber = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, "")
            }
        });
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

    const handleFinishQuoteRequest = () => {
        if (Number(formData.amount) <= 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "The Amount must be greater than zero!"
            }));
            setShowAlert(true);
            return;
        }

        const amount = {
            amount: +formData.amount,
            price: +formData.price,
        }

        props.onFinishWizard(amount);
    }

    const handleBackward = () => {
        props.onBackward();
    }

    useEffect(() => {
        setFormData({
            user: props.wizardData.user,
            product: props.wizardData.product,
            price: props.wizardData.price,
            drawings: props.wizardData.drawings,
            drawingsImages: props.wizardData.drawingsImages,
            drawingsImagesFile: props.wizardData.drawingsImagesFile,
            background: props.wizardData.background,
            backgroundDescription: props.wizardData.backgroundDescription,
            backgroundImage: props.wizardData.backgroundImage,
            backgroundImageFile: props.wizardData.backgroundImageFile,
            amount: props.wizardData.amount,
        });
    }, [props.wizardData])

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card>
                <Card.Header as={"h4"}>
                    And finally tell us HOW MANY of these you're interested
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
                        <BorderedRow title={"Drawings"}>
                            <Col md="auto">
                                <div className="bordered-panel bordered-panel-tn">
                                    {formData.drawingsImages &&
                                        <Image src={formData.drawingsImagesFile}
                                               fluid width="100" title={formData.drawingsImages}/>
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
                                    <small>{formData.drawingsImages}</small>
                                </Form.Group>
                            </Col>
                        </BorderedRow>
                        <BorderedRow title={"Background"}>
                            <Col md="auto">
                                <div className="bordered-panel bordered-panel-tn">
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
                                    <Form.Text muted>Tell us your idea</Form.Text>
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
                        </BorderedRow>
                        <Row>
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
                                        style={{ textAlign: "right" }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="actions action-justify-right">
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Previous Step"
                              type="custom-success"
                              customClass="fa fa-backward"
                              onClick={handleBackward}
                />
                <CustomButton caption="Request Quote"
                              type="custom-primary"
                              customClass="fa fa-money-check-dollar"
                              onClick={handleFinishQuoteRequest}
                />
            </div>
        </>
    );
}