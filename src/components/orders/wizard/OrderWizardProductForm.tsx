import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useProductsApi from "../../../hooks/useProductsApi";
import { AlertType, uiActions } from "../../../store/uiSlice";
import { AlertToast } from "../../ui/AlertToast";
import { AutoCompleteInput } from "../../ui/AutoCompleteInput";
import { CustomButton } from "../../ui/CustomButton";

export const OrderWizardProductForm = (props) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const { products } = useProductsApi();
    const [formData, setFormData] = useState({
        product: "",
        price: 0,
    });

    const handleSelectProduct = (product) => {
        const selectedProduct = products.find(p => p.name === product);
        setFormData(prevState => {
            return {
                ...prevState,
                product: product,
                price: selectedProduct.price,
            }
        })
    }

    const isValidData = (): boolean => {
        const { product } = formData;
        if (product.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "Product must be provided!"
            }));
            setShowAlert(true);
            return false;
        }
        return true;
    }

    const handleChangeNumber = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, "")
            }
        });
    }

    const handleForward = () => {
        if (!isValidData()) return;
        const product = {
            product: formData.product,
            price: formData.price,
        }
        props.onForward(product)
    }

    const handleBackward = () => {
        props.onBackward();
    }

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card>
                <Card.Header>
                    Now we need to know WHAT you want to buy from us
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Product<span aria-hidden="true"
                                                             className="required">*</span></Form.Label>
                                    <AutoCompleteInput
                                        data={products}
                                        displayFields="name"
                                        value={formData.product}
                                        onFieldSelected={handleSelectProduct}
                                        className="bigger-input"
                                        required
                                        placeholder="Please select a product"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Suggested Price<span aria-hidden="true"
                                                                     className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChangeNumber}
                                        autoComplete="off"
                                        style={{ textAlign: "right" }}
                                        disabled
                                    />
                                    <small>We will call you to offer better price if you order more than one
                                        product</small>
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
                <CustomButton caption="Next Step"
                              type="custom-success"
                              customClass="fa fa-forward"
                              onClick={handleForward}
                />
            </div>
        </>
    );
}
