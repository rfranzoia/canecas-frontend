import {useContext, useEffect, useState} from "react";
import {Card, Image} from "react-bootstrap";
import {imageHelper, ImageOpType} from "../ui/ImageHelper";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {servicesApi} from "../../api/ServicesAPI";
import {StatusCodes} from "http-status-codes";
import {ButtonAction, getActionIcon} from "../ui/Actions";

export const EditTypeForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const type = props.type;
    const [image, setImage] = useState(null);
    const [imageOpType, setImageOpType] = useState(ImageOpType.VIEW);
    const [formData, setFormData] = useState({
        description: "",
        image: "",
    });
    const [file, setFile] = useState({
        selectedFile: null
    });

    const handleSave = async (event) => {
        event.preventDefault();
        await appCtx.checkValidLogin();

        if (!isDataValid()) return;

        if (imageOpType === ImageOpType.NEW) {
            const sendResult = await servicesApi.withToken(appCtx.userData.authToken).uploadImage(file.selectedFile);

            if (sendResult instanceof Error) {
                appCtx.handleAlert(true, AlertType.DANGER, "Upload File Error!", sendResult);
                return;

            } else if (sendResult.statusCode !== StatusCodes.OK) {
                appCtx.handleAlert(true, AlertType.DANGER, sendResult.name, sendResult.description);
                return;
            }
        }

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

    const load = async (name) => {
        setImage(await imageHelper.getImageFromServer(name));
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    }

    const handleChangeFile = (event) => {
        event.preventDefault();
        setFile({selectedFile: event.target.files[0]});
        setFormData(prevState => {
            return {
                ...prevState,
                image: event.target.files[0].name
            }
        })
    };

    const handleFileClick = () => {
        document.getElementById("file").click();
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
        imageHelper.getImage(load, type.image);
    }, [type.description, type.image])

    useEffect(() => {
        setImageOpType(props.op === OpType.VIEW?
            ImageOpType.VIEW:
            props.op === OpType.EDIT?
                ImageOpType.EDIT:
                ImageOpType.NEW);
    }, [])

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
                                <div className="flex-control">
                                    <input className="form-control bigger-input"
                                           id="image"
                                           name="image"
                                           required type="url"
                                           value={formData.image}
                                           onChange={handleChange}
                                           disabled
                                    />
                                    <input
                                        type="file"
                                        id="file"
                                        className="form-control bigger-input"
                                        placeholder="Enter your name here"
                                        name="file"
                                        onChange={handleChangeFile}
                                        style={{display: 'none'}}
                                    />
                                    {props.op !== OpType.VIEW &&
                                        getActionIcon(ButtonAction.IMAGE_EDIT, "Select Image", true, handleFileClick)
                                    }
                                </div>
                            </div>
                        </div>
                        {viewOnly &&
                            <div className="flex-centered-container">
                                <Image src={image}
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