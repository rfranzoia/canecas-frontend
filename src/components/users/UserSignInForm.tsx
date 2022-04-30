import { StatusCodes } from "http-status-codes";
import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { usersApi } from "../../api/UsersAPI";
import { authActions } from "../../store/authSlice";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { ShowType } from "./UserRegistration";
import styles from "./users.module.css";

export const UserSignInForm = (props) => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleHideError = () => {
        dispatch(uiActions.handleAlert({ show: false }));
        setShowAlert(false);
    }

    const handleSignIn = async (credentials) => {
        const res = await usersApi.login(credentials.email, credentials.password);
        if (res.statusCode === StatusCodes.OK) {
            const user = {
                userId: res.data._id,
                name: res.data.name,
                userEmail: res.data.email,
                authToken: res.data.authToken,
                role: res.data.role
            };
            dispatch(authActions.login(user));
            props.onClose();
            history.replace("/");
        } else {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: res?.name,
                message: res?.description
            }));
            setShowAlert(true);
        }
    }

    const handleChangeLogin = (event) => {
        const { name, value } = event.target;
        handleHideError();
        setUser(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    return (
        <>
            <AlertToast/>
            <Card border="dark" className={styles["registration-width-login"]}>
                <Card.Header as="h4">Sign In</Card.Header>
                <Card.Body>
                    <AlertToast showAlert={showAlert}/>
                    <Form>
                        <Form.Group className="spaced-form-group">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                className="bigger-input"
                                value={user.email}
                                placeholder="Enter your e-mail address"
                                onChange={handleChangeLogin}/>
                        </Form.Group>
                        <Form.Group className="spaced-form-group">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                className="bigger-input"
                                value={user.password}
                                placeholder="Please enter your password"
                                onChange={handleChangeLogin}/>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <p>
                Need an account?&nbsp;
                <span onClick={() => props.onShowType(ShowType.SIGN_UP)}><Link to="#">Sign Up</Link></span>
            </p>
            <div className="actions">
                <CustomButton caption="Cancel" onClick={props.onClose} type="close"/>
                <CustomButton caption="Sign In" onClick={() => handleSignIn(user)} type="sign-in"/>
            </div>
        </>
    );
}