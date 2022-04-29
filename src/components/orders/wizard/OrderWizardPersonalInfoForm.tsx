import { useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Role } from "../../../domain/User";
import { AlertType, uiActions } from "../../../store/uiSlice";
import { AlertToast } from "../../ui/AlertToast";
import { CustomButton } from "../../ui/CustomButton";

export const OrderWizardPersonalInfoForm = (props) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
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
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "All fields are required"
            }));
            setShowAlert(true);
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
            <AlertToast showAlert={showAlert}/>
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