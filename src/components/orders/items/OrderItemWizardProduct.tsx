import {useContext, useEffect, useState} from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {AlertType, ApplicationContext} from "../../../context/ApplicationContext";
import {WizardFormData} from "../Orders";
import {Variation} from "../../../domain/Variation";
import {Variations} from "../../variations/Variations";
import {productsApi} from "../../../api/ProductsAPI";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";
import {AlertToast} from "../../ui/AlertToast";
import {CustomButton} from "../../ui/CustomButton";
import Modal from "../../ui/Modal";
import {StatusCodes} from "http-status-codes";

import styles from "../orders.module.css";

export const OrderItemWizardProduct = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
    const [showVariationsModal, setShowVariationsModal] = useState(false);
    const [formData, setFormData] = useState({
        product: "",
        price: 0,
    });

    const handleSearchVariations = () => {
        setShowVariationsModal(true);
    }

    const handleCloseVariationsModal = () => {
        setShowVariationsModal(false);
    }

    const handleSelectVariation = (variation: Variation) => {
        setShowVariationsModal(false);
        const selectedVariation: WizardFormData = {
            product: variation.product,
            background: variation.background,
            drawings: variation.drawings,
            price: variation.price,
        }
        props.onSelect(selectedVariation);
    }

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

    useEffect(() => {
        const load = async () => {
            const res = await productsApi.list();
            if (res.statusCode === StatusCodes.OK) {
                setProducts(res.data);
            } else {
                setProducts([]);
            }
        }

        load().then(undefined);

    }, []);

    useEffect(() => {
        setFormData({
            product: props.orderItem.product,
            price: props.orderItem.price,
        })
    }, [props.orderItem])

    return (
        <>
            { appCtx.alert.show && <AlertToast /> }
            <Card className="order-item-wizard-card">
                <Card.Header>Select the PRODUCT</Card.Header>
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
                                        className={styles["custom-autocomplete"]}
                                        required
                                        placeholder="Enter the product name"/>
                                    <small>If you don't see all available products, try scrolling down the list</small>
                                </Form.Group>
                            </Col>
                            <Col md={1}>
                                <Form.Group>
                                    <Form.Label>&nbsp;&nbsp;</Form.Label>
                                    <div style={{ marginTop: "0.5rem", marginLeft: "-1rem"}}>
                                        {getActionIcon(ActionIconType.SEARCH, {
                                            title: "search",
                                            canClick: true,
                                            onClick: () => handleSearchVariations()
                                        })}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="auto">
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Product Base Price<span aria-hidden="true" className="required">*</span></Form.Label>
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
                                    <small>You will be able to change this in the last step</small>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="actions action-justify-right order-item-wizard-card">
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Next"
                              type="custom-success"
                              customClass="fa fa-forward"
                              onClick={handleForward}
                />
            </div>
            {showVariationsModal &&
                <Modal
                    style={{ width: "45rem", maxHeight: "45rem", overflow: "scroll"}}
                    onClose={handleCloseVariationsModal} >
                    <Variations onClose={handleCloseVariationsModal}
                                onSelect={handleSelectVariation}
                                isModal="yes"
                    />
                </Modal>
            }
        </>
    );
}

