import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Variation } from "../../domain/Variation";
import useProductsApi from "../../hooks/useProductsApi";
import useServiceApi from "../../hooks/useServiceApi";
import useVariationsApi from "../../hooks/useVariationsApi";
import { OpType } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { AlertToast } from "../ui/AlertToast";
import { AutoCompleteInput } from "../ui/AutoCompleteInput";
import { CustomButton } from "../ui/CustomButton";
import { imageHelper } from "../ui/ImageHelper";
import styles from "./variations.module.css";

const emptyFormData = {
    _id: null,
    product: "",
    caricature: 0,
    background: "empty",
    price: 0,
    image: "",
};

export const VariationEditForm = (props) => {
    const { uploadImage } = useServiceApi("variation");
    const { products, findProduct } = useProductsApi();
    const [viewOnly, setViewOnly] = useState(false);
    const [image, setImage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const { get } = useVariationsApi(false);
    const [formData, setFormData] = useState(emptyFormData);
    const [file, setFile] = useState({
        selectedFile: null,
    });

    const isValidData = (): boolean => {
        const { product, caricature, background, price, image } = formData;
        if (product.trim().length === 0 || background.trim().length === 0 || image.trim().length === 0) {
            dispatch(
                uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: "Validation Error!",
                    message: "All fields are required to save the variation!",
                })
            );
            setShowAlert(true);
            return false;
        }
        if (isNaN(caricature) || isNaN(price)) {
            dispatch(
                uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: "Validation Error!",
                    message: "You must inform valid number of Caricatures and Price!",
                })
            );
            setShowAlert(true);
            return false;
        }
        if (price <= 0) {
            dispatch(
                uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: "Validation Error!",
                    message: "Product, Price value must be greater than zero!",
                })
            );
            setShowAlert(true);
            return false;
        }
        return true;
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value,
            };
        });
    };

    const handleSelectProduct = (product) => {
        const selectedProduct = findProduct(product);
        setFormData((prevState) => {
            return {
                ...prevState,
                product: product,
                price: selectedProduct.price,
            };
        });
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const handleSave = async () => {
        if (!isValidData()) return;
        if (props.op === OpType.NEW) {
            const selectedProduct = findProduct(formData.product);

            if (!selectedProduct) {
                dispatch(
                    uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: "Adding Error!",
                        message: "Error adding product!",
                    })
                );
                setShowAlert(true);
                return;
            }

            const sendResult = await uploadImage(file.selectedFile);

            if (sendResult instanceof Error) {
                dispatch(
                    uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: "Upload File Error!",
                        message: sendResult,
                    })
                );
                setShowAlert(true);
                return;
            } else if (sendResult.statusCode !== StatusCodes.OK) {
                dispatch(
                    uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: sendResult.name,
                        message: sendResult.description,
                    })
                );
                setShowAlert(true);
                return;
            }
        }

        const variation: Variation = {
            _id: formData._id,
            product: formData.product,
            caricature: Number(formData.caricature),
            background: formData.background,
            price: Number(formData.price),
            image: formData.image,
        };

        props.onSave(variation);
    };

    const handleChangeNumber = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value.replace(/[^0-9.,]+/, ""),
            };
        });
    };

    const handleChangeFile = async (event) => {
        event.preventDefault();
        setFile({ selectedFile: event.target.files[0] });
        setImage(await imageHelper.convertToBase64(event.target.files[0]));
        setFormData((prevState) => {
            return {
                ...prevState,
                image: event.target.files[0].name,
            };
        });
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
    };

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name, "variation"));
    };

    useEffect(() => {
        const call = async () => {
            if (!props.variationId) {
                setFormData(emptyFormData);
                return;
            }
            const v = await get(props.variationId);
            if (v) {
                setFormData({
                    _id: v._id,
                    product: v.product,
                    background: v.background,
                    caricature: v.caricature,
                    price: v.price,
                    image: v.image,
                });
                setShowAlert(false);
                imageHelper.getImage(loadImage, v.image);
            }
        };
        call().then(undefined);
    }, [get, props.variationId, setShowAlert]);

    useEffect(() => {
        setViewOnly(props.op === OpType.VIEW);
    }, [props.op]);

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark" className={styles["variations-edit-modal"]}>
                <Card.Header as="h3">{props.op === OpType.NEW ? "New" : "Edit"} Variation</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={"auto"}>
                                <div className={"bordered-panel bordered-panel-lg"}>
                                    {image && <Image src={image} fluid width="500" title={formData.image}/>}
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <Form.Label>
                                                Product
                                                <span aria-hidden="true" className="required">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <AutoCompleteInput
                                                data={products}
                                                displayFields="name"
                                                value={formData.product}
                                                className={styles["custom-autocomplete"]}
                                                disabled={viewOnly || props.op === OpType.EDIT}
                                                onFieldSelected={handleSelectProduct}
                                                placeholder="Please select a product"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="spaced-form-group">
                                            <Form.Label>
                                                Caricatures
                                                <span aria-hidden="true" className="required">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <Form.Select
                                                value={formData.caricature}
                                                className="bigger-select"
                                                onChange={handleChange}
                                                disabled={viewOnly || props.op === OpType.EDIT}
                                                name="caricature"
                                            >
                                                <option value={0}>No caricature</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={9}>+3</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group className="spaced-form-group">
                                            <Form.Label>
                                                Background
                                                <span aria-hidden="true" className="required">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <div style={{ padding: "0.5rem", border: "1px solid #cdcdcd" }}>
                                                <Form.Check
                                                    type="radio"
                                                    label="Empty"
                                                    id="bgEmpty"
                                                    name="background"
                                                    value="empty"
                                                    disabled={viewOnly || props.op === OpType.EDIT}
                                                    checked={formData.background === "empty"}
                                                    onChange={handleChange}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="Personalized"
                                                    id="bgPersonalized"
                                                    name="background"
                                                    disabled={viewOnly || props.op === OpType.EDIT}
                                                    value="personalized"
                                                    checked={formData.background === "personalized"}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="spaced-form-group">
                                            <Form.Label>
                                                Price
                                                <span aria-hidden="true" className="required">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <input
                                                className="form-control bigger-input"
                                                required
                                                type="text"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChangeNumber}
                                                autoComplete="off"
                                                style={{ textAlign: "right" }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Group>
                                            <Form.Label>
                                                Image
                                                <span aria-hidden="true" className="required">
                                                    *
                                                </span>
                                            </Form.Label>
                                            <div className="flex-control">
                                                <input
                                                    className="form-control bigger-input"
                                                    id="image"
                                                    name="image"
                                                    required
                                                    type="url"
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
                                                    style={{ display: "none" }}
                                                />
                                                {props.op !== OpType.VIEW &&
                                                    getActionIcon(
                                                        ActionIconType.IMAGE_EDIT,
                                                        "Select Variation Image",
                                                        !viewOnly,
                                                        handleFileClick
                                                    )}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            {!viewOnly && (
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">
                        *
                    </span>
                    Required field(s)
                </p>
            )}
            <div className="actions">
                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                <CustomButton caption="Save" onClick={handleSave} type="save"/>
            </div>
        </>
    );
};
