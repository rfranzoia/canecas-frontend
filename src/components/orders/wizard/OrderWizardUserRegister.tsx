import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Role } from "../../../domain/User";
import { AlertType, uiActions } from "../../../store/uiSlice";
import { AlertToast } from "../../ui/AlertToast";
import { CustomButton } from "../../ui/CustomButton";
import { ShowType } from "../../users/UserRegistration";
import styles from "./orderWizard.module.css";

export const OrderWizardUserRegister = (props) => {
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
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }
    const isValidData = () => {
        const { name, phone, email } = formData;
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
        props.onForward({ user: user })
    }

    const handleChangeToSignIn = () => {
        props.onChangeUserForm(ShowType.SIGN_IN);
    }

    useEffect(() => {
        if (props.wizardData.user) {
            setFormData({
                role: props.wizardData.user.role,
                name: props.wizardData.user.name,
                email: props.wizardData.user.email,
                password: props.wizardData.user.password,
                phone: props.wizardData.user.phone,
                address: props.wizardData.user.address,
            })
        }
    }, [props.wizardData])

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card>
                <Card.Header as={"h4"}>
                    Lets start with some basic information of yours ...
                </Card.Header>
                <Card.Body>
                    <form>
                        <div className="form-group spaced-form-group">
                            <label>Name<span aria-hidden="true"
                                             className="required">*</span></label>
                            <input
                                required
                                type="text"
                                className={styles["fancy-input"]}
                                placeholder="Enter your name here"
                                name="name"
                                value={formData.name}
                                autoComplete={"off"}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group spaced-form-group">
                            <label>Email<span aria-hidden="true"
                                              className="required">*</span></label>
                            <input
                                required
                                type="email"
                                className={styles["fancy-input"]}
                                placeholder="Enter email for login"
                                name="email"
                                value={formData.email}
                                autoComplete={"off"}
                                onChange={handleChange}/>
                            <small>This will be your login information</small>
                        </div>
                        <div className="form-group spaced-form-group">
                            <label>Phone<span aria-hidden="true"
                                              className="required">*</span></label>
                            <input
                                type="text"
                                className={styles["fancy-input"]}
                                placeholder="Please enter you Phone number"
                                name="phone"
                                value={formData.phone}
                                autoComplete={"off"}
                                onChange={handleChange}/>
                            <small>This is how we'll mainly contact you</small>
                        </div>
                    </form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)<br/>
                Already a customer?click&nbsp;
                <span onClick={() => handleChangeToSignIn()}><Link to="#">here</Link></span>
                &nbsp;to sign in
            </p>
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