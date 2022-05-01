import { useEffect, useState } from "react";
import { Card, Col, Form, Image } from "react-bootstrap";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";
import { BorderedRow } from "../../ui/BorderedRow";
import { CustomButton } from "../../ui/CustomButton";
import { imageHelper } from "../../ui/ImageHelper";

export const OrderWizardBackground = (props) => {
    const [formData, setFormData] = useState({
        user: null,
        product: "",
        price: 0,
        caricatures: 0,
        caricatureImages: "",
        caricatureImagesFile: null,
        background: "empty",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
    });

    const handleChangeFile = async (event) => {
        event.preventDefault();
        const image = await imageHelper.convertToBase64(event.target.files[0]);
        setFormData(prevState => {
            return {
                ...prevState,
                backgroundImage: event.target.files[0].name,
                backgroundImageFile: image,
            }
        })
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
        if (name === "background" && value === "empty") {
            setFormData(prevState => (
                {
                    ...prevState,
                    backgroundDescription: "",
                    backgroundImage: "",
                    backgroundImageFile: null,
                }
            ))
        }
    }

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    const handleForward = () => {
        const background = {
            background: formData.background,
            backgroundDescription: formData.backgroundDescription,
            backgroundImage: formData.backgroundImage,
            backgroundImageFile: formData.backgroundImageFile,
        }
        props.onForward(background)
    }

    const handleBackward = () => {
        props.onBackward();
    }

    useEffect(() => {
        setFormData({
            user: props.wizardData.user,
            product: props.wizardData.product,
            price: props.wizardData.price,
            caricatures: props.wizardData.caricatures,
            caricatureImages: props.wizardData.caricatureImages,
            caricatureImagesFile: props.wizardData.caricatureImagesFile,
            background: props.wizardData.background,
            backgroundDescription: props.wizardData.backgroundDescription,
            backgroundImage: props.wizardData.backgroundImage,
            backgroundImageFile: props.wizardData.backgroundImageFile,
        });

    }, [props.wizardData])

    return (
        <>
            <Card>
                <Card.Header>
                    Now tell us how do you wish the BACKGROUND of the product to be
                </Card.Header>
                <Card.Body>
                    <Form>
                        <BorderedRow title={"Background"} required>
                            <Col md="auto">
                                <div className="bordered-panel">
                                    {formData.backgroundImage &&
                                        <Image src={formData.backgroundImageFile}
                                               fluid width="200" title={formData.backgroundImage}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Check type="radio"
                                                label="Empty"
                                                id="bgEmpty"
                                                name="background"
                                                value="empty"
                                                checked={formData.background === "empty"}
                                                onChange={handleChange}/>
                                    <Form.Check type="radio"
                                                label="Personalized"
                                                id="bgPersonalized"
                                                name="background"
                                                value="personalized"
                                                checked={formData.background === "personalized"}
                                                onChange={handleChange}/>
                                    <Form.Group className="spaced-form-group">
                                        <label htmlFor="description">Tell us your idea</label>
                                        <textarea className="form-control bigger-input"
                                                  id="description"
                                                  name="backgroundDescription"
                                                  rows={3}
                                                  value={formData.backgroundDescription}
                                                  disabled={formData.background === "empty"}
                                                  onChange={handleChange}/>

                                        <label htmlFor="image">Do you have a picture of your idea?</label>
                                        <div className="flex-control">
                                            <input className="form-control bigger-input"
                                                   id="image"
                                                   name="backgroundImage"
                                                   required type="url"
                                                   value={formData.backgroundImage}
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
                                                disabled={formData.background === "empty"}
                                                style={{ display: 'none' }}
                                            />
                                            {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", formData.background === "personalized", handleFileClick)}
                                        </div>
                                    </Form.Group>
                                </Form.Group>
                            </Col>
                        </BorderedRow>
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