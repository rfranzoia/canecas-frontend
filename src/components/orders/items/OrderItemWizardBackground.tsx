import {CustomButton} from "../../ui/CustomButton";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../../context/ApplicationContext";
import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Image, Row} from "react-bootstrap";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";
import {imageHelper} from "../../ui/ImageHelper";

import "./orderItemWizard.css";

export const OrderItemWizardBackground = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        product: "",
        drawings: 0,
        drawingsImage: "",
        drawingsImageFile: null,
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
        const {name, value} = event.target;
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
            product: props.orderItem.product,
            drawings: props.orderItem.drawings,
            drawingsImage: props.orderItem.drawingsImage,
            drawingsImageFile: props.orderItem.drawingsImageFile,
            background: props.orderItem.background,
            backgroundDescription: props.orderItem.backgroundDescription,
            backgroundImage: props.orderItem.backgroundImage,
            backgroundImageFile: props.orderItem.backgroundImageFile,
        });

    }, [props.orderItem])

    return (
        <>
            {appCtx.alert.show && <AlertToast/>}
            <Card className="order-item-wizard-card">
                <Card.Header>
                    Select the BACKGROUND type
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Product<span aria-hidden="true"
                                                             className="required">*</span></Form.Label>
                                    <Form.Control
                                        value={formData.product}
                                        onChange={handleChange}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="auto">
                                <div className="tinny-bordered-panel">
                                    {formData.drawingsImage &&
                                        <Image src={formData.drawingsImageFile}
                                               fluid width="100" title={formData.drawingsImage}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Drawings<span aria-hidden="true"
                                                              className="required">*</span></Form.Label>
                                    <Form.Select value={formData.drawings}
                                                 className="bigger-select"
                                                 disabled
                                                 onChange={handleChange}
                                                 name="drawings">
                                        <option value={0}>No drawings</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </Form.Select>
                                    <small>{formData.drawingsImage}</small>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br/>
                        <Row>
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
                                    <Form.Label>Background<span aria-hidden="true"
                                                                className="required">*</span></Form.Label>
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
                                                style={{display: 'none'}}
                                            />
                                            {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", formData.background === "personalized", handleFileClick)}
                                        </div>
                                    </Form.Group>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <div className="actions action-justify-right order-item-wizard-card">
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Previous"
                              type="custom-success"
                              customClass="fa fa-backward"
                              onClick={handleBackward}
                />
                <CustomButton caption="Next"
                              type="custom-success"
                              customClass="fa fa-forward"
                              onClick={handleForward}
                />
            </div>
        </>
    );
}