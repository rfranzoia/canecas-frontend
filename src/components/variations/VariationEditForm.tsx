import {useCallback, useContext, useEffect, useState} from "react";
import {Card, Col, Form, Image, Row} from "react-bootstrap";
import {StatusCodes} from "http-status-codes";
import {Variation} from "../../domain/Variation";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {variationsApi} from "../../api/VariationAPI";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {AlertToast} from "../ui/AlertToast";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {imageHelper} from "../ui/ImageHelper";
import useProducts from "../../hooks/useProducts";
import useServiceApi from "../../hooks/useServiceApi";
import styles from "./variations.module.css"

export const VariationEditForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const {uploadImage} = useServiceApi("variation");
    const {products, findProduct} = useProducts();
    const [viewOnly, setViewOnly] = useState(false);
    const [image, setImage] = useState(null);
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

    const {handleAlert} = appCtx;

    const isValidData = (): boolean => {
        const { product, drawings, background, price, image } = formData;
        if (product.trim().length === 0 || background.trim().length === 0 ||
            image.trim().length === 0) {
            handleAlert(true, AlertType.DANGER, "Validation Error!", "All fields are required to save the variation!");
            return false;
        }
        if (isNaN(drawings) || isNaN(price)) {
            handleAlert(true, AlertType.DANGER, "Validation Error!", "You must inform valid number of Drawings and Price!");
            return false;
        }
        if (price <= 0) {
            handleAlert(true, AlertType.DANGER, "Validation Error!", "Product, Price value must be greater than zero!");
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
        const selectedProduct = findProduct(product);
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

    const handleSave = async () => {
        if (!isValidData()) return;
        if (props.op === OpType.NEW) {
            const selectedProduct = findProduct(formData.product);

            if (!selectedProduct) {
                handleAlert(true, AlertType.DANGER, "Adding Error!", "Error adding product!");
                return;
            }

            const sendResult = await uploadImage(file.selectedFile);

            if (sendResult instanceof Error) {
                handleAlert(true, AlertType.DANGER, "Upload File Error!", sendResult);
                return;

            } else if (sendResult.statusCode !== StatusCodes.OK) {
                handleAlert(true, AlertType.DANGER, sendResult.name, sendResult.description);
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
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, "")
            }
        });
    }

    const handleChangeFile = async (event) => {
        event.preventDefault();
        setFile({selectedFile: event.target.files[0]});
        setImage(await imageHelper.convertToBase64(event.target.files[0]))
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

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name, "variation"));
    }

    const getVariation = useCallback(async () => {
        if (!props.variationId && props.op !== OpType.EDIT) return;
        variationsApi.withToken(appCtx.userData.authToken)
            .get(props.variationId)
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    console.error(result.name, JSON.stringify(result.description));
                    handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                } else {
                    setFormData({
                        _id: result.data._id,
                        product: result.data.product,
                        background: result.data.background,
                        drawings: result.data.drawings,
                        price: result.data.price,
                        image: result.data.image,
                    })
                    imageHelper.getImage(loadImage, result.data.image);
                }
            })
    }, [appCtx.userData.authToken, handleAlert, props.op, props.variationId])

    useEffect(() => {
        getVariation().then(undefined);
    },[getVariation])

    useEffect(() => {
        setViewOnly(props.op === OpType.VIEW)
    }, [props.op])

    return (
        <>
            <AlertToast />
            <Card border="dark" className={styles["variations-edit-modal"]}>
                <Card.Header as="h3">{props.op === OpType.NEW?"New":"Edit"} Variation</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={"auto"}>
                                <div className={"bordered-panel bordered-panel-lg"}>
                                    {image &&
                                        <Image src={image}
                                        fluid width="500" title={formData.image}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <Form.Label>Product<span aria-hidden="true"
                                                                     className="required">*</span></Form.Label>
                                            <AutoCompleteInput
                                                data={products}
                                                displayFields="name"
                                                value={formData.product}
                                                className={styles["custom-autocomplete"]}
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
                                                <option value={0}>No drawings</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={9}>+3</option>
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
                                                autoComplete="off"
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
                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                <CustomButton caption="Save" onClick={handleSave} type="save"/>
            </div>

        </>
    );
}