import {useEffect, useState} from "react";
import {Alert, Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {CustomButton} from "../ui/CustomButton";
import {ALERT_TIMEOUT} from "../../context/ApplicationContext";

export const EditTypeForm = (props) =>  {
    const type = props.type;
    const [formData, setFormData] = useState({
        description: "",
        image: "",
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: ""
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
            }, ALERT_TIMEOUT)
        }
    }

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
            handleAlert(true, "danger", "Validation Error", "All fields are required to save!");
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

    return (
        <>
            {alert.show &&
                <div>
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            }
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label htmlFor="description">Name<span aria-hidden="true"
                                                           className="required">*</span></label>
                    <input className="form-control" id="name" name="description" required type="text" 
                           value={formData.description} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image<span aria-hidden="true"
                                                      className="required">*</span></label>
                    <input className="form-control" id="image" name="image" required type="url" 
                           value={formData.image} onChange={handleChange} disabled={viewOnly}/>
                    {viewOnly &&
                        <div className="container4">
                            <hr/>
                            <Image src={imageHelper.getImageUrl(type.image)}
                                   fluid width="400" title={type.image}/>
                        </div>
                    }
                </div>
            </form>
            <br/>
            <div className="align-content-end">
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