import {useContext, useEffect, useState} from "react";
import {productsApi} from "../../api/ProductsAPI";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {Card, Col, Form, Row} from "react-bootstrap";
import {Variation} from "../../domain/Variation";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {variationsApi} from "../../api/VariationAPI";

export const VariationEditForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState([]);
    const [viewOnly, setViewOnly] = useState(false);
    const [formData, setFormData] = useState({
        _id: null,
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
        const selectedProduct = products.find(p => p.name === product);
        setFormData(prevState => {
            return {
                ...prevState,
                product: product,
                price: selectedProduct.price,
            }
        })
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleSave = () => {
        if (!isValidData()) return;
        if (props.op == OpType.NEW) {
            const selectedProduct = products.find(product => product.name === formData.product);
            if (!selectedProduct) {
                appCtx.handleAlert(true, AlertType.DANGER, "Adding Error!", "Error adding product!");
                return;
            }
        }
        const variation: Variation = {
            _id: formData._id,
            product: formData.product,
            drawings: Number(formData.drawings),
            background: formData.background,
            price: Number(formData.price),
            image: formData.image,
        }
        props.onSave(variation);
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
        if (!props.variationId && props.op !== OpType.EDIT) return;
        variationsApi.withToken(appCtx.userData.authToken)
            .get(props.variationId)
            .then(result => {
                if (!result._id) {
                    console.error(result.name, JSON.stringify(result.description));
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                } else {
                    setFormData({
                        _id: result._id,
                        product: result.product,
                        background: result.background,
                        drawings: result.drawings,
                        price: result.price,
                        image: result.image,
                    })
                }
            })
    },[props.variationId])

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
            <Card border="dark">
                <Card.Header as="h3">{props.op === OpType.NEW?"New":"Edit"} Variation</Card.Header>
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
                                        disabled={viewOnly || props.op === OpType.EDIT}
                                        onFieldSelected={handleSelectProduct}
                                        placeholder="Please select a product"/>
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

                        </Row>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Price<span aria-hidden="true" className="required">*</span></Form.Label>
                                    <input
                                        className="form-control bigger-input"
                                        required
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChangeNumber}
                                        disabled={viewOnly}
                                        style={{textAlign: "right"}}/>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
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
                </Card.Body>
            </Card>
            { !viewOnly &&
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            }
            <div className="actions">
                <CustomButton caption="Save" onClick={handleSave} type="save"/>
                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
            </div>

        </>
    );
}