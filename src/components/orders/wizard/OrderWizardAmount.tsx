import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { CustomButton } from "../../ui/CustomButton";

export const OrderWizardAmount = (props) => {
    const [formData, setFormData] = useState({
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

    const handleFinishOrder = () => {
        const amount = {
            amount: formData.amount,
        }
        props.onFinish({amount: amount});
    }

    const handleBackward = () => {
        props.onBackward();
    }

    return (
        <>
            <Card>
                <Card.Header>
                    And finally tell us HOW MANY of these you're interested
                </Card.Header>
                <Card.Body>
                    <Form>
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
                                        style={{textAlign: "right"}}
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
                <CustomButton caption="Finish Order"
                              type="custom-primary"
                              customClass="fa fa-forward"
                              onClick={handleFinishOrder}
                />
            </div>
        </>
    );
}