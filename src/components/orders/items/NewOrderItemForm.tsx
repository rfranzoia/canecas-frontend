import {useContext, useEffect, useState} from "react";
import {productsApi} from "../../../api/ProductsAPI";
import {Card, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {CustomButton} from "../../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../../context/ApplicationContext";
import {AlertToast} from "../../ui/AlertToast";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";
import {Variations} from "../../variations/Variations";
import {Variation} from "../../../domain/Variation";

export const NewOrderItemForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
    const [showVariationsModal, setShowVariationsModal] = useState(false);
    const [formData, setFormData] = useState({
        product: "",
        drawings: 0,
        background: "",
        price: 0,
        amount: 0,
    });

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

    const handleSearchVariations = () => {
        setShowVariationsModal(true);
    }

    const handleCloseVariationsModal = () => {
        setShowVariationsModal(false);
    }

    const handleSelectVariation = (variation: Variation) => {
        setShowVariationsModal(false);
        setFormData(prevState => {
            return {
                ...prevState,
                product: variation.product,
                background: variation.background,
                drawings: variation.drawings,
                price: variation.price,
            }
        })
        document.getElementById("amount").focus();
    }

    const handleAdd = () => {
        if (!isValidData()) return;
        const selectedProduct = products.find(product => product.name === formData.product);
        if (!selectedProduct) {
            appCtx.handleAlert(true, AlertType.DANGER, "Adding Error!", "Error adding product!");
            return;
        }
        const item = {
            product: formData.product,
            drawings: Number(formData.drawings),
            background: formData.background,
            price: isNaN(Number(formData.price)) ? 0 : Number(formData.price),
            amount: isNaN(Number(formData.amount)) ? 0 : Number(formData.amount),
            _id: selectedProduct._id,
        }
        props.onItemAdd(item);
    }

    const isValidData = (): boolean => {
        const { product, price, amount } = formData;
        if (product.trim().length === 0 || price.toString().trim().length === 0 ||
            amount.toString().trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "Product, price and amount must be provided!");
            return false;
        }
        if (isNaN(price) || isNaN(amount)) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "Price and Amount must be valid numbers!");
            return false;
        }
        if (price <= 0 || amount <= 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "Product, price and amount must be greater than zero!");
            return false;
        }
        return true;
    }
    const handleCancel = () => {
        props.onCancelItemAdd();
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

    const handleChangeNumber = (event) => {
        const {name, value} = event.target;
        console.log(value.replace(/[^0-9.,]+/, ""))
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, "")
            }
        });
    }

    return (
        <>
            <AlertToast />
            <Card border="dark" className="align-content-center" style={{width: '29.2rem'}}>
                <Card.Body>
                    <Container>
                        <Form onSubmit={handleAdd}>
                            <Row>
                                <Col md={11}>
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
                                <Col md={4}>
                                    <Form.Group className="spaced-form-group">
                                        <Form.Label>Drawings<span aria-hidden="true"
                                                                  className="required">*</span></Form.Label>
                                        <Form.Select value={formData.drawings}
                                                     className="bigger-select"
                                                     onChange={handleChange}
                                                     name="drawings">
                                            <option value={0}>0</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={9}>+ de 3</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={8}>
                                    <Form.Group className="spaced-form-group">
                                        <Form.Label>Background<span aria-hidden="true"
                                                                    className="required">*</span></Form.Label>
                                        <div style={{ padding: "0.5rem", border: "1px solid #cdcdcd"}}>
                                            <Form.Check type="radio"
                                                        label="Empty"
                                                        id="bgEmpty"
                                                        name="background"
                                                        value="empty"
                                                        checked={formData.background === "empty"}
                                                        onChange={handleChange} />
                                            <Form.Check type="radio"
                                                        label="Personalized"
                                                        id="bgPersonalized"
                                                        name="background"
                                                        value="personalized"
                                                        checked={formData.background === "personalized"}
                                                        onChange={handleChange} />
                                        </div>
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
                                            name="price"
                                            value={formData.price}
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
                        <br/>
                        <Row>
                            <Col>
                                <CustomButton caption="Add" onClick={handleAdd} type="add"/>
                                &nbsp;
                                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                                <p aria-hidden="true" id="required-description">
                                    <span aria-hidden="true" className="required">*</span>Required field(s)
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
            {showVariationsModal &&
                <Modal
                    show={showVariationsModal}
                    style={{ maxHeight: "45rem"}}
                    onHide={handleCloseVariationsModal}
                    backdrop="static"
                    keyboard={true}
                    centered size="lg">
                    <Modal.Body>
                        <Variations onClose={handleCloseVariationsModal}
                                    onSelect={handleSelectVariation}
                                    isModal="yes"
                        />
                    </Modal.Body>
                </Modal>
            }
        </>
    );
}