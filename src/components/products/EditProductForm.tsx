import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import useServiceApi from "../../hooks/useServiceApi";
import { OpType } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { imageHelper, ImageOpType } from "../ui/ImageHelper";

export const EditProductForm = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const product = props.product;
    const { uploadImage } = useServiceApi("product");
    const [image, setImage] = useState(null);
    const [imageOpType, setImageOpType] = useState(ImageOpType.VIEW);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: product.name,
        description: "",
        price: 0,
        image: ""
    });
    const [file, setFile] = useState({
        selectedFile: null
    });

    const isDataValid = (): boolean => {
        const { name, description, price, image } = formData;

        if (name.trim().length === 0 || description.trim().length === 0 || image.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "All fields are required to save!"
            }));
            setShowAlert(true);
            return false;
        }

        if (Number(price) <= 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "Product price must be greater than zero!"
            }));
            setShowAlert(true);
            return false;
        }
        return true;
    }

    const load = async (name) => {
        setImage(await imageHelper.getImageFromServer(name, "product"));
    }

    const handleSave = async (event) => {
        event.preventDefault();

        if (!isDataValid()) return;

        if (imageOpType === ImageOpType.NEW) {
            const sendResult = await uploadImage(file.selectedFile);

            if (sendResult instanceof Error) {
                dispatch(uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: "Upload File Error!",
                    message: sendResult
                }));
                setShowAlert(true);
                return;

            } else if (sendResult.statusCode !== StatusCodes.OK) {
                dispatch(uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: sendResult.name,
                    message: sendResult.description
                }));
                setShowAlert(true);
                return;
            }
        }

        const product = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            image: formData.image
        }
        props.onSave(product);
    }

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
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

    const handleChangeFile = async (event) => {
        event.preventDefault();
        setFile({ selectedFile: event.target.files[0] });
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

    useEffect(() => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image
        });
        imageHelper.getImage(load, product.image);

    }, [product]);

    useEffect(() => {
        setImageOpType(props.op === OpType.VIEW ?
            ImageOpType.VIEW :
            props.op === OpType.EDIT ?
                ImageOpType.EDIT :
                ImageOpType.NEW);
    }, [props.op]);

    const viewOnly = props.op === OpType.VIEW;
    const title = props.op === OpType.NEW ? "New" :
        props.op === OpType.EDIT ? "Edit" : "View";

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark">
                <Card.Header as="h3">{`${title} Product`}</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={"auto"}>
                                <div className="bordered-panel bordered-panel-lg">
                                    {formData.image &&
                                        <Image src={image}
                                               fluid width="500" title={product.image}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Row>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <label htmlFor="name">Name<span aria-hidden="true"
                                                                            className="required">*</span></label>
                                            <input className="form-control bigger-input"
                                                   id="name"
                                                   name="name"
                                                   required
                                                   type="text"
                                                   autoComplete={"off"}
                                                   value={formData.name}
                                                   onChange={handleChange}
                                                   disabled={viewOnly}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <label htmlFor="description">Description<span aria-hidden="true"
                                                                                          className="required">*</span></label>
                                            <textarea className="form-control bigger-input"
                                                      id="description"
                                                      name="description"
                                                      required
                                                      rows={3}
                                                      value={formData.description} onChange={handleChange}
                                                      disabled={viewOnly}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <label htmlFor="price">Starting Price<span aria-hidden="true"
                                                                                       className="required">*</span></label>
                                            <input
                                                className="form-control bigger-input"
                                                required
                                                type="text"
                                                name="price"
                                                value={viewOnly ? formData.price.toFixed(2) : formData.price}
                                                onChange={handleChangeNumber}
                                                autoComplete={"off"}
                                                style={{ textAlign: "right" }}
                                                disabled={viewOnly}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group className="spaced-form-group">
                                            <label htmlFor="image">Image<span aria-hidden="true"
                                                                              className="required">*</span></label>
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
                                                    placeholder="Enter your name here"
                                                    name="file"
                                                    onChange={handleChangeFile}
                                                    style={{ display: 'none' }}
                                                />
                                                {props.op !== OpType.VIEW &&
                                                    getActionIcon(ActionIconType.IMAGE_EDIT, "Select Image", true, handleFileClick)
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
            {!viewOnly &&
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            }
            <div className="actions">
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={props.onCancel} type="close"/>
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
            </div>
        </>
    );
}
