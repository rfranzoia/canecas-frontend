import {Card} from "react-bootstrap";
import {CustomButton} from "../../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../../context/ApplicationContext";
import {Role} from "../../../domain/User";
import {useContext, useState} from "react";
import {AlertToast} from "../../ui/AlertToast";

export const OrderWizardPersonalInfoForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
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
    const isValidData = () => {
        const {name, phone, email} = formData;
        if (name.trim().length === 0 || phone.trim().length === 0 ||
            email.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error!", "All fields are required");
            return false;
        }
        return true;
    }

    const handleForward = () => {
        if (!isValidData()) return;
        const user = {
            ...formData,
            password: "password",
            role: Role.GUEST
        }
        props.onForward({user: user})
    }

    return (
        <>
            { appCtx.alert.show && <AlertToast /> }
            <Card>
                <Card.Header>
                    First we need some information so we can start your order.
                </Card.Header>
                <Card.Body>
                    <form>
                        <div className="form-group spaced-form-group">
                            <label>Name<span aria-hidden="true"
                                             className="required">*</span></label>
                            <input
                                required
                                type="text"
                                className="form-control bigger-input"
                                placeholder="Enter your name here"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group spaced-form-group">
                            <label>Email<span aria-hidden="true"
                                              className="required">*</span></label>
                            <input
                                required
                                type="email"
                                className="form-control bigger-input"
                                placeholder="Enter email for login"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}/>
                            <small>This will be your login information</small>
                        </div>
                        <div className="form-group spaced-form-group">
                            <label>Phone<span aria-hidden="true"
                                              className="required">*</span></label>
                            <input
                                type="text"
                                className="form-control bigger-input"
                                placeholder="Please enter you Phone number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}/>
                            <small>This is how we'll mainly contact you</small>
                        </div>
                        <br/>
                    </form>
                </Card.Body>
            </Card>
            <div className="actions action-justify-right">
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Next Step"
                              type="custom-success"
                              customClass="fa fa-forward"
                              onClick={handleForward}
                />
            </div>
        </>
    );
}