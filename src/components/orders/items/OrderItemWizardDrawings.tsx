import {CustomButton} from "../../ui/CustomButton";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../../context/ApplicationContext";
import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Image, Row} from "react-bootstrap";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";
import {imageHelper} from "../../ui/ImageHelper";

import "./orderItemWizard.css";

export const OrderItemWizardDrawings = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        product: "",
        drawings: 0,
        drawingsImage: "",
        drawingsImageFile: null,
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
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
                    imageFile: null,
                    imageName: "",
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
                drawingsImage: event.target.files[0].name,
                drawingsImageFile: image,
            }
        })
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    const handleForward = () => {
        const drawings = {
            drawings: formData.drawings,
            drawingsImage: formData.drawingsImage,
            drawingsImageFile: formData.drawingsImageFile,
        }
        props.onForward(drawings)
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
        });
    }, [props.orderItem])

    return (
        <>
            {appCtx.alert.show && <AlertToast/>}
            <Card className="order-item-wizard-card">
                <Card.Header>
                    Select the amount of DRAWINGS
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
                                <div className="bordered-panel">
                                    {formData.drawingsImageFile &&
                                        <Image src={formData.drawingsImageFile}
                                               fluid width="200" title={formData.drawingsImage}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Drawings<span aria-hidden="true"
                                                              className="required">*</span></Form.Label>
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
                                    <Form.Label>Photo</Form.Label>
                                    <div className="flex-control">
                                        <input className="form-control bigger-input"
                                               id="image"
                                               name="image"
                                               required type="url"
                                               value={formData.drawingsImage}
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
                                        {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", true, handleFileClick)}
                                    </div>
                                    <small>If the photo is not available just ignore this</small>
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