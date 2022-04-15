import {useContext, useEffect, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Card, Col, Container, Image, Row} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {StatusCodes} from "http-status-codes";
import {servicesApi} from "../../api/ServicesAPI";
import {ButtonAction, getActionIcon} from "../ui/Actions";

enum ImageDivType { VIEW, EDIT, NEW}

export const EditProductForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const product = props.product;
    const [image, setImage] = useState(null);
    const [originalImage, setOriginalImage] = useState(props.product.image);
    const [divIndex, setDivIndex] = useState(ImageDivType.VIEW);
    const [formData, setFormData] = useState({
        name: product.name,
        description: "",
        price: 0,
        type: "",
        image: ""
    });
    const [file, setFile] = useState({
        selectedFile: null
    });

    const [types, setTypes] = useState([]);

    const isDataValid = (): boolean => {
        const {name, description, price, type, image} = formData;

        if (name.trim().length === 0 || description.trim().length === 0 ||
            type.trim().length === 0 || image.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "All fields are required to save!");
            return false;
        }

        if (Number(price) <= 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Product price must be greater than zero!");
            return false;
        }
        return true;
    }

    const getImage = () => {
        const load = async () => {
            setImage(await imageHelper.getImageFromServer(product.image));
        }

        load().then(() => null);
    }

    const handleSave = async (event) => {
        event.preventDefault();
        if (!isDataValid()) return;

        if (divIndex === ImageDivType.NEW) {
            const sendResult = await servicesApi.withToken(appCtx.userData.authToken).uploadImage(file.selectedFile);

            if (sendResult instanceof Error) {
                appCtx.handleAlert(true, AlertType.DANGER, "Upload File Error!", sendResult);
                return;

            } else if (sendResult.statusCode !== StatusCodes.OK) {
                appCtx.handleAlert(true, AlertType.DANGER, sendResult.name, sendResult.description);
                return;
            }
        }

        const product = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            type: formData.type,
            image: formData.image
        }
        props.onSave(product);
    }

    const handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
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

    const handleNumberInput = (e) => {
        e.preventDefault();
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

    const handleSelectType = (type) => {
        setFormData(prevState => {
            return {
                ...prevState,
                type: type
            }
        })
    }

    const handleChangeDiv = () => {
        document.getElementById("file").click();
        /*
        setDivIndex(prevState => {
            if (prevState === ImageDivType.EDIT) {
                return ImageDivType.NEW;
            } else {
                setFormData(prevState => {
                    return {
                        ...prevState,
                        image: originalImage
                    }
                })
                return ImageDivType.EDIT
            }
        })

         */
    }

    useEffect(() => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            type: product.type,
            image: product.image
        });
        setOriginalImage(product.image);
        getImage();

    }, [product]);

    useEffect(() => {
        typesApi.list()
            .then(data => {
                setTypes(data);
            });

        setDivIndex(props.op === OpType.VIEW?
                        ImageDivType.VIEW:
                            props.op === OpType.EDIT?
                                ImageDivType.EDIT:
                                ImageDivType.NEW);
    }, []);

    const viewOnly = props.op === OpType.VIEW;
    const title = props.op === OpType.NEW ? "New" :
        props.op === OpType.EDIT ? "Edit" : "View";

    console.log(originalImage)
    return (
        <>
            <AlertToast />
            <Card border="dark">
                <Card.Header as="h3">{`${title} Product`}</Card.Header>
                <form onSubmit={handleSave}>
                    <Container>
                        <Row>
                            {viewOnly &&
                                <Col>
                                    <div className="flex-item-image-auto">
                                        <Image src={image}
                                               fluid width="600" title={product.image}/>
                                    </div>
                                </Col>
                            }
                            <Col>
                                <div>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="name">Name<span aria-hidden="true"
                                                                        className="required">*</span></label>
                                        <input className="form-control bigger-input" id="name" name="name" required type="text"
                                               value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                                    </div>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="description">Description<span aria-hidden="true"
                                                                                      className="required">*</span></label>
                                        <textarea className="form-control bigger-input" id="description" name="description"
                                                  required
                                                  rows={3}
                                                  value={formData.description} onChange={handleChange}
                                                  disabled={viewOnly}/>
                                    </div>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="price">Price<span aria-hidden="true"
                                                                          className="required">*</span></label>
                                        <input
                                            className="form-control bigger-input"
                                            required
                                            type="text"
                                            name="price"
                                            value={viewOnly? formData.price.toFixed(2): formData.price}
                                            onChange={handleChange}
                                            style={{textAlign: "right"}}
                                            disabled={viewOnly}
                                            onInput={handleNumberInput}/>
                                    </div>
                                    <div className="form-group spaced-form-group">
                                        <label htmlFor="type">Type<span aria-hidden="true"
                                                                        className="required">*</span></label>
                                        <AutoCompleteInput
                                            data={types}
                                            value={formData.type}
                                            disabled={viewOnly}
                                            onFieldSelected={handleSelectType}
                                            className="form-control bigger-input"
                                            required
                                            placeholder="Please select a type"/>
                                    </div>
                                    <div className="form-group spaced-form-group">
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
                                                style={{display: 'none'}}
                                            />
                                            {props.op !== OpType.VIEW &&
                                                getActionIcon(ButtonAction.IMAGE_EDIT, "Select Image", true, handleChangeDiv)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </Card>
            <div className="default-margin">
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={props.onCancel} type="close"/>
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            </div>
        </>
    );
}
