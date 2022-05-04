import { useEffect, useState } from "react";
import { Card, Col, Form, Image, Row } from "react-bootstrap";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";
import { BorderedRow } from "../../ui/BorderedRow";
import { CustomButton } from "../../ui/CustomButton";
import { imageHelper } from "../../ui/ImageHelper";
import styles from "../orders.module.css";

export const OrderItemWizardCaricatures = (props) => {
    const [formData, setFormData] = useState({
        product: "",
        caricatures: 0,
        caricatureImages: "",
        caricatureImagesFile: null,
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
        if (name === "caricatures" && Number(value) === 0) {
            setFormData(prevState => (
                {
                    ...prevState,
                    caricatureImagesFile: null,
                    caricatureImages: "",
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
                caricatureImages: event.target.files[0].name,
                caricatureImagesFile: image,
            }
        })
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
    }

    const handleForward = () => {
        const caricatures = {
            caricatures: formData.caricatures,
            caricatureImages: formData.caricatureImages,
            caricatureImagesFile: formData.caricatureImagesFile,
        }
        props.onForward(caricatures)
    }

    const handleBackward = () => {
        props.onBackward();
    }

    useEffect(() => {
        setFormData({
            product: props.orderItem.product,
            caricatures: props.orderItem.caricatures,
            caricatureImages: props.orderItem.caricatureImages,
            caricatureImagesFile: props.orderItem.caricatureImagesFile,
        });
    }, [props.orderItem])

    return (
        <>
            <Card className="order-item-wizard-card">
                <Card.Header>
                    Select the amount of CARICATURES
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
                        <BorderedRow title={"Caricatures"} required>
                            <Col md="auto">
                                <div className="bordered-panel">
                                    {formData.caricatureImagesFile &&
                                        <Image src={formData.caricatureImagesFile}
                                               fluid width="200" title={formData.caricatureImages}/>
                                    }
                                </div>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <select value={formData.caricatures}
                                                 className={styles["fancy-input"]}
                                                 onChange={handleChange}
                                                 name="caricatures">
                                        <option value={0}>No caricature</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </select>
                                </Form.Group>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Photo</Form.Label>
                                    <div className="flex-control">
                                        <input className={styles["fancy-input"]}
                                               id="image"
                                               name="image"
                                               required type="url"
                                               value={formData.caricatureImages}
                                               onChange={handleChange}
                                               disabled
                                        />
                                        <input
                                            type="file"
                                            id="file"
                                            className={styles["fancy-input"]}
                                            placeholder="Enter the file name here"
                                            name="file"
                                            onChange={handleChangeFile}
                                            style={{ display: 'none' }}
                                        />
                                        {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", true, handleFileClick)}
                                    </div>
                                    <small>If the photo is not available just ignore this</small>
                                </Form.Group>
                            </Col>
                        </BorderedRow>
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