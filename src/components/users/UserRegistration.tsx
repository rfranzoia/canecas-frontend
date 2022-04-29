import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { usersApi } from "../../api/UsersAPI";
import { Role } from "../../domain/User";
import { authActions } from "../../store/authSlice";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";

import styles from "./users.module.css"

export const enum ShowType { SIGN_IN, SIGN_UP}

export const UserRegistration = (props) => {
    const history = useHistory();
    const [showAlert, setShowAlert] = useState(false);
    const [showType, setShowType] = useState(ShowType.SIGN_IN);
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [userRegister, setUserRegister] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const handleShowType = (showType: ShowType) => {
        setShowType(showType);
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
            props.handleClose();
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

    const handleSignUp = async () => {
        if (!isDataValid()) return;

        const user = {
            role: Role.GUEST,
            name: userRegister.name,
            email: userRegister.email,
            password: userRegister.password,
            phone: userRegister.phone,
            address: userRegister.address,
        };

        const res = await usersApi.create(user);
        if (res.statusCode !== StatusCodes.CREATED) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: res?.name,
                message: res?.description
            }));
            setShowAlert(true);
        } else {
            setShowAlert(false);
            handleShowType(ShowType.SIGN_IN);
        }
    }

    const isDataValid = (): boolean => {
        const { name, email, password, confirmPassword, phone } = userRegister;

        if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 ||
            phone.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "Name, Email, Phone and Password are required!"
            }));
            setShowAlert(true);
            return false;
        }

        if (password !== confirmPassword) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error",
                message: "Password and Password confirmation don't match!"
            }));
            setShowAlert(true);
            return false;
        }

        return true;
    }

    const handleHideError = () => {
        dispatch(uiActions.handleAlert({ show: false }));
        setShowAlert(false);
    }

    const handleChangeRegister = (event) => {
        const { name, value } = event.target;
        setUserRegister((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

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

    const formSignIn = (
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
                <span onClick={() => handleShowType(ShowType.SIGN_UP)}><Link to="#">Sign Up</Link></span>
            </p>
            <div className="actions">
                <CustomButton caption="Cancel" onClick={props.handleClose} type="close"/>
                <CustomButton caption="Sign In" onClick={() => handleSignIn(user)} type="sign-in"/>
            </div>

        </>
    )

    useEffect(() => {
        setShowType(props.showType);
    }, [props.showType]);

    const formSignUp = (
        <>
            <Card border="dark" className={styles["registration-width-signup"]}>
                <Card.Header as="h4">Sign Up</Card.Header>
                <Card.Body>
                    <AlertToast showAlert={showAlert}/>
                    <Form>
                        <Row>
                            <Form.Group className="spaced-form-group">
                                <label>Name<span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="form-control bigger-input"
                                    placeholder="Enter your name here"
                                    name="name"
                                    value={userRegister.name}
                                    onChange={handleChangeRegister}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="spaced-form-group">
                                <label>Email address<span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="email"
                                    className="form-control bigger-input"
                                    placeholder="Enter email for login"
                                    name="email"
                                    value={userRegister.email}
                                    onChange={handleChangeRegister}
                                />
                                <small>This will be your login information</small>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Password<span aria-hidden="true" className="required">*</span></label>
                                    <input
                                        required
                                        type="password"
                                        className="form-control bigger-input"
                                        placeholder="Enter a password"
                                        name="password"
                                        value={userRegister.password}
                                        onChange={handleChangeRegister}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Confirm Password<span aria-hidden="true"
                                                                 className="required">*</span></label>
                                    <input
                                        required
                                        type="password"
                                        className="form-control bigger-input"
                                        placeholder="Confirm your password"
                                        name="confirmPassword"
                                        value={userRegister.confirmPassword}
                                        onChange={handleChangeRegister}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Phone<span aria-hidden="true"
                                                      className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control bigger-input"
                                        placeholder="Enter your Phone"
                                        name="phone"
                                        value={userRegister.phone}
                                        onChange={handleChangeRegister}
                                    />
                                    <small>This is how we'll mainly contact you</small>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Address</label>
                                    <input
                                        type="address"
                                        className="form-control bigger-input"
                                        placeholder="Enter your Address"
                                        name="address"
                                        value={userRegister.address}
                                        onChange={handleChangeRegister}
                                    />
                                    <small>No need to be full address here</small>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)<br/>
                Already registered?&nbsp;
                <span onClick={() => handleShowType(ShowType.SIGN_IN)}><Link to="#">Sign In</Link></span>
            </p>
            <div className="actions">
                <CustomButton caption="Cancel" onClick={props.handleClose} type="close"/>
                <CustomButton caption="Sign Up" onClick={handleSignUp} type="sign-up"/>
            </div>

        </>
    )

    if (props.show) {
        return (
            <Modal
                onClose={props.handleClose}>
                <div>
                    {showType === ShowType.SIGN_IN && formSignIn}
                    {showType === ShowType.SIGN_UP && formSignUp}
                </div>
            </Modal>
        )
    }

    return null;
}