import { useEffect, useState } from "react";
import { Card, Col, Form, Image } from "react-bootstrap";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";
import { BorderedRow } from "../../ui/BorderedRow";
import { CustomButton } from "../../ui/CustomButton";
import { imageHelper } from "../../ui/ImageHelper";

export const OrderWizardDrawingsForm = (props) => {
    const [formData, setFormData] = useState({
        user: null,
        product: "",
        price: 0,
        drawings: 0,
        drawingsImages: "",
        drawingsImagesFile: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
        if (name === "drawings" && Number(value) === 0) {
            setFormData(prevState => (
                {
                    ...prevState,
                    drawingsImagesFile: null,
                    drawingsImages: "",
                }
            ))
        }
    }

    const handleChangeFile = async (event) => {
        event.preventDefault();
        const image = await imageHelper.convertToBase64(event.target.files[0]);
        setFormData(prevState => {
            return {
                ...prevState,
                drawingsImages: event.target.files[0].name,
                drawingsImagesFile: image,
            }
        })
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    const handleForward = () => {
        const drawings = {
            drawings: formData.drawings,
            drawingsImages: formData.drawingsImages,
            drawingsImagesFile: formData.drawingsImagesFile,
        }
        props.onForward(drawings)
    }

    const handleBackward = () => {
        props.onBackward();
    }

    useEffect(() => {
        setFormData({
            user: props.wizardData.user,
            product: props.wizardData.product,
            price: props.wizardData.price,
            drawings: props.wizardData.drawings,
            drawingsImages: props.wizardData.drawingsImages,
            drawingsImagesFile: props.wizardData.drawingsImagesFile,
        });
    }, [props.wizardData])

    return (
        <>
            <Card>
                <Card.Header as={"h4"}>
                    Do you want any DRAWINGS in your product?
                </Card.Header>
                <Card.Body>
                    <Form>
                        <BorderedRow title={"Drawings"}>
                            <Col md="auto">
                                <div className="bordered-panel">
                                    {formData.drawingsImagesFile &&
                                        <Image src={formData.drawingsImagesFile}
                                               fluid width="200" title={formData.drawingsImages}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Select value={formData.drawings}
                                                 className="bigger-select"
                                                 onChange={handleChange}
                                                 name="drawings">
                                        <option value={0}>No drawings</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Do you have a Photo?</Form.Label>
                                    <div className="flex-control">
                                        <input className="form-control bigger-input"
                                               id="image"
                                               name="image"
                                               required type="url"
                                               value={formData.drawingsImages}
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
                                            style={{ display: 'none' }}
                                        />
                                        {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", (formData.drawings > 0), handleFileClick)}
                                    </div>
                                    <small>If the photo is not available just ignore this</small>
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