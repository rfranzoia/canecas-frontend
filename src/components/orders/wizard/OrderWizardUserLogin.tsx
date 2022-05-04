import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User } from "../../../domain/User";
import useUsersApi from "../../../hooks/useUsersApi";
import { RootState } from "../../../store";
import { uiActions } from "../../../store/uiSlice";
import { AlertToast } from "../../ui/AlertToast";
import { CustomButton } from "../../ui/CustomButton";
import { ShowType } from "../../users/UserRegistration";
import styles from "./orderWizard.module.css";

export const OrderWizardUserLogin = (props) => {
    const dispatch = useDispatch();
    const { login } = useUsersApi(false);
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const handleHideError = () => {
        dispatch(uiActions.handleAlert({ show: false }));
        setShowAlert(false);
    }

    const handleChangeLogin = (event) => {
        const { name, value } = event.target;
        handleHideError();
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const signIn = async () => {
        const result = await login(formData.email, formData.password);
        if (result) {
            result();
            setShowAlert(true);
            return false
        }
        return true;
    }

    const handleForward = async () => {
        if (!await signIn()) return;
        const user = {
            ...formData,
            email: formData.email,
            password: formData.password,
            name: loggedUser.name,
            phone: loggedUser.phone,
            role: loggedUser.role,
        }
        props.onForward({ user: user })
    }

    const handleChangeToSignUp = () => {
        props.onChangeUserForm(ShowType.SIGN_UP);
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
                    Inform your E-MAIL and PASSWORD to start ordering ...
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="spaced-form-group">
                            <Form.Label>Email
                                <span aria-hidden="true" className="required">*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                className={styles["fancy-input"]}
                                value={formData.email}
                                placeholder="Enter your e-mail address"
                                onChange={handleChangeLogin}/>
                        </Form.Group>
                        <Form.Group className="spaced-form-group">
                            <Form.Label>Password
                                <span aria-hidden="true" className="required">*</span>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                className={styles["fancy-input"]}
                                value={formData.password}
                                placeholder="Please enter your password"
                                onChange={handleChangeLogin}/>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)<br/>
                Not a customer yet?click&nbsp;
                <span onClick={() => handleChangeToSignUp()}><Link to="#">here</Link></span>
                &nbsp;to register
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