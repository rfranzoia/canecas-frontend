import {useContext, useEffect, useState} from "react";
import {Card, Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const EditTypeForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const type = props.type;
    const [formData, setFormData] = useState({
        description: "",
        image: "",
    });

    const handleSave = (event) => {
        event.preventDefault();
        if (!isDataValid()) return;

        const type = {
            description: formData.description,
            image: formData.image,
        }
        props.onSaveType(type);
    }

    const isDataValid = (): boolean => {
        const {description, image} = formData;

        if (description.trim().length === 0 || image.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "All fields are required to save!");
            return false;
        }

        return true;
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    useEffect(() => {
        setFormData({
            description: type.description,
            image: type.image,
        });
    }, [type.description, type.image])

    const viewOnly = props.op === "view";
    const title = props.op === "new" ? "New" :
        props.op === "edit" ? "Edit" : "View";

    return (
        <>
            <AlertToast/>
            <Card border="dark">
                <Card.Header as="h3">{`${title} Type`}</Card.Header>
                <Card.Body>
                    <form onSubmit={handleSave}>
                        <div>
                            <div className="form-group spaced-form-group">
                                <label htmlFor="description">Name<span aria-hidden="true"
                                                                       className="required">*</span></label>
                                <input className="form-control bigger-input" id="name" name="description" required
                                       type="text"
                                       value={formData.description} onChange={handleChange} disabled={viewOnly}/>
                            </div>
                            <div className="form-group spaced-form-group">
                                <label htmlFor="image">Image<span aria-hidden="true"
                                                                  className="required">*</span></label>
                                <input className="form-control bigger-input" id="image" name="image" required type="url"
                                       value={formData.image} onChange={handleChange} disabled={viewOnly}/>
                            </div>
                        </div>
                        {viewOnly &&
                            <div className="flex-centered-container">
                                <Image src={imageHelper.getImageUrl(type.image)}
                                       fluid width="400" title={type.image}/>
                            </div>
                        }
                    </form>
                </Card.Body>

            </Card>
            <div className="default-margin">
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            </div>
        </>
    );
}