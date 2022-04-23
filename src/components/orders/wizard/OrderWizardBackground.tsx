import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Row} from "react-bootstrap";
import {CustomButton} from "../../ui/CustomButton";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../../context/ApplicationContext";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";

export const OrderWizardBackground = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        background: "",
        backgroundDescription: "",
        drawingsImage: "",
        drawingsImageFile: null,
    });

    const handleChangeFile = (event) => {
        event.preventDefault();
        setFormData(prevState => {
            return {
                ...prevState,
                drawingsImage: event.target.files[0].name,
                drawingsImageFile: event.target.files[0]
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
    }

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    const handleForward = () => {
        const background = {
            background: formData.background,
            backgroundImage: formData.drawingsImage,
            backgroundImageFile: formData.drawingsImageFile,
        }
        props.onForward(background)
    }

    const handleBackward = () => {
        props.onBackward();
    }

    return (
        <>
            {appCtx.alert.show && <AlertToast/>}
            <Card>
                <Card.Header>
                    Now tell us how do you wish the BACKGROUND of the product to be
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
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
                                    { formData.background === "personalized" &&
                                        <>
                                            <label htmlFor="description">Tell us your idea</label>
                                            <textarea className="form-control bigger-input"
                                                      id="description"
                                                      name="backgroundDescription"
                                                      rows={3}
                                                      value={formData.backgroundDescription}
                                                      onChange={handleChange} />

                                            <label htmlFor="image">Do you have a picture of your idea?</label>
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
                                                { getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", true, handleFileClick) }
                                            </div>
                                        </>
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
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