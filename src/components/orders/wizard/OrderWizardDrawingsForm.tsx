import {CustomButton} from "../../ui/CustomButton";
import {AlertToast} from "../../ui/AlertToast";
import {Card, Col, Form, Row} from "react-bootstrap";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../../context/ApplicationContext";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";

export const OrderWizardDrawingsForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        drawings: 0,
        drawingsImages: "",
        drawingsImagesFile: null,
    });

    const handleChange = (event) => {
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
        setFormData(prevState => {
            return {
                ...prevState,
                drawingsImages: event.target.files[0].name,
                drawingsImagesFile: event.target.files[0]
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

    return (
        <>
            { appCtx.alert.show && <AlertToast /> }
            <Card>
                <Card.Header>
                    And how many DRAWINGS you want in your product??
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
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
                                    {formData.drawings > 0 &&
                                        <>
                                            <label htmlFor="image">Do you have your photo(s) yet?</label>
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