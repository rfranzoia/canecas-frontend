import { useEffect, useState } from "react";
import { Card, Col, Form, Image } from "react-bootstrap";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";
import { BorderedRow } from "../../ui/BorderedRow";
import { CustomButton } from "../../ui/CustomButton";
import { imageHelper } from "../../ui/ImageHelper";
import styles from "../../users/users.module.css";

export const OrderWizardCaricatures = (props) => {
    const [formData, setFormData] = useState({
        user: null,
        product: "",
        price: 0,
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
            user: props.wizardData.user,
            product: props.wizardData.product,
            price: props.wizardData.price,
            caricatures: props.wizardData.caricatures,
            caricatureImages: props.wizardData.caricatureImages,
            caricatureImagesFile: props.wizardData.caricatureImagesFile,
        });
    }, [props.wizardData])

    return (
        <>
            <Card>
                <Card.Header as={"h4"}>
                    Do you want any CARICATURES in your product?
                </Card.Header>
                <Card.Body>
                    <Form>
                        <BorderedRow title={"Caricatures"}>
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
                                    <Form.Select value={formData.caricatures}
                                                 className={styles["fancy-input"]}
                                                 onChange={handleChange}
                                                 name="caricatures">
                                        <option value={0}>No caricature</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={9}>+ de 3</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Do you have a Photo?</Form.Label>
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
                                        {getActionIcon(ActionIconType.IMAGE_EDIT, "Select Variation Image", (formData.caricatures > 0), handleFileClick)}
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