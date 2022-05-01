import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useUsersApi from "../../hooks/useUsersApi";
import { uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { ShowType } from "./UserRegistration";
import styles from "./users.module.css";

export const UserSignInForm = (props) => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const { login } = useUsersApi(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const handleHideError = () => {
        dispatch(uiActions.handleAlert({ show: false }));
        setShowAlert(false);
    }

    const handleSignIn = async (credentials) => {
        const result = await login(credentials.email, credentials.password);
        if (result) {
            result();
            setShowAlert(true);
        } else {
            props.onClose();
            history.replace("/");
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