import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../../context/ApplicationContext";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {CustomButton} from "../../ui/CustomButton";
import {productsApi} from "../../../api/ProductsAPI";

export const OrderWizardProductForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
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
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "Product must be provided!");
            return false;
        }
        return true;
    }

    const handleChangeNumber = (event) => {
        const {name, value} = event.target;
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

    useEffect(() => {
        const load = async () => {
            const res = await productsApi.list();
            if (res) {
                setProducts(res);
            } else {
                setProducts([]);
            }
        }

        load().then(() => undefined);

    }, []);

    return (
        <>
            { appCtx.alert.show && <AlertToast /> }
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
                                    <Form.Label>Suggested Price<span aria-hidden="true" className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChangeNumber}
                                        autoComplete="off"
                                        style={{textAlign: "right"}}
                                        disabled
                                    />
                                    <small>We will call you to offer better price if you order more than one product</small>
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
