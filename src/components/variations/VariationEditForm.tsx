import {useContext, useEffect, useState} from "react";
import {productsApi} from "../../api/ProductsAPI";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {Card, Col, Form, Row} from "react-bootstrap";
import {Variation} from "../../domain/Variation";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";

export const VariationEditForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
    const [viewOnly, setViewOnly] = useState(false);
    const [formData, setFormData] = useState({
        product: "",
        drawings: 0,
        background: "empty",
        price: 0,
        image: "",
    });
    const [file, setFile] = useState({
        selectedFile: null
    });

    const isValidData = (): boolean => {
        const { product, drawings, background, price, image } = formData;
        if (product.trim().length === 0 || background.trim().length === 0 ||
            image.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "All fields are required to save the variation!");
            return false;
        }
        if (isNaN(drawings) || isNaN(price)) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "You must inform valid number of Drawings and Price!");
            return false;
        }
        if (price <= 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "Product, Price value must be greater than zero!");
            return false;
        }
        return true;
    }

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    const handleSelectProduct = (product) => {
        setFormData(prevState => {
            return {
                ...prevState,
                product: product
            }
        })
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleAdd = () => {
        if (!isValidData()) return;
        const selectedProduct = products.find(product => product.name === formData.product);
        if (!selectedProduct) {
            appCtx.handleAlert(true, AlertType.DANGER, "Adding Error!", "Error adding product!");
            return;
        }
        const variation: Variation = {
            product: formData.product,
            drawings: Number(formData.drawings),
            background: formData.background,
            price: Number(formData.price),
            image: formData.image,
        }
        props.onAdd(variation);
    }

    const handleNumberInput = (e) => {
        let {name, value} = e.target;
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        if (isNaN(value)) {
            value = 0;
        }
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: Number(value).toFixed(2)
            }
        });
    }

    const handleChangeFile = (event) => {
        event.preventDefault();
        setFile({selectedFile: event.target.files[0]});
        setFormData(prevState => {
            return {
                ...prevState,
                image: event.target.files[0].name
            }
        })
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    useEffect(() => {
        productsApi.list()
            .then(result => {
                if (result) {
                    setProducts(result);
                } else {
                    appCtx.handleAlert(true, AlertType.WARNING, "Loading Products!", "Could not load products list!");
                    setProducts([]);
                }
            });
    },[])

    useEffect(() => {
        setViewOnly(props.op === OpType.VIEW)
    }, [props.op])

    return (
        <>
            <AlertToast />
            <Card border="dark" style={{ width: "47.7rem"}}>
                <Card.Header as="h3">{props.op === OpType.NEW?"New":"Edit"} Variation</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Product<span aria-hidden="true"
                                                                className="required">*</span></Form.Label>
                                    <AutoCompleteInput
                                        data={products}
                                        displayFields="name"
                                        value={formData.product}
                                        disabled={viewOnly || props.op === OpType.EDIT}
                                        onFieldSelected={handleSelectProduct}
                                        placeholder="Please select a product"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
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
                                                    disabled={viewOnly || props.op === OpType.EDIT}
                                                    checked={formData.background === "empty"}
                                                    onChange={handleChange} />
                                        <Form.Check type="radio"
                                                    label="Personalized"
                                                    id="bgPersonalized"
                                                    name="background"
                                                    disabled={viewOnly || props.op === OpType.EDIT}
                                                    value="personalized"
                                                    checked={formData.background === "personalized"}
                                                    onChange={handleChange} />
                                    </div>


                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Drawings<span aria-hidden="true"
                                                                className="required">*</span></Form.Label>
                                    <Form.Select value={formData.drawings}
                                                 className="bigger-select"
                                                 onChange={handleChange}
                                                 disabled={viewOnly || props.op === OpType.EDIT}
                                                 name="drawings">
                                        <option value={0}>0</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Price<span aria-hidden="true" className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        required
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        disabled={viewOnly}
                                        style={{textAlign: "right"}}
                                        onInput={handleNumberInput}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Image<span aria-hidden="true" className="required">*</span></Form.Label>
                                    <div className="flex-control">
                                        <input className="form-control bigger-input"
                                               id="image"
                                               name="image"
                                               required type="url"
                                               value={formData.image}
                                               onChange={handleChange}
                                               disabled
                                        />
                                        <input
                                            type="file"
                                            id="file"
                                            className="form-control bigger-input"
                                            placeholder="Enter the file name here"
                                            name="file"
                                            onChange={handleChangeFile}
                                            style={{display: 'none'}}
                                        />
                                        {props.op !== OpType.VIEW &&
                                            getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", !viewOnly, handleFileClick)
                                        }
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                    <br/>
                    <CustomButton caption="Add" onClick={handleAdd} type="add"/>
                    &nbsp;
                    <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                    <p aria-hidden="true" id="required-description">
                        <span aria-hidden="true" className="required">*</span>Required field(s)
                    </p>
                </Card.Body>
            </Card>

        </>
    );
}