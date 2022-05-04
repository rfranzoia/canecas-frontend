import { useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Role } from "../../domain/User";
import useUsersApi from "../../hooks/useUsersApi";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { ShowType } from "./UserRegistration";
import styles from "./users.module.css";

export const UserSignUpForm = (props) => {
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const { create } = useUsersApi(false);

    const [userRegister, setUserRegister] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

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

        const error = await create(user);
        if (error) {
            error();
            setShowAlert(true);
        } else {
            setShowAlert(false);
            props.onShowType(ShowType.SIGN_IN);
        }

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

    return (
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
                                    className={styles["fancy-input"]}
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
                                    className={styles["fancy-input"]}
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
                                        className={styles["fancy-input"]}
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
                                        className={styles["fancy-input"]}
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
                                        className={styles["fancy-input"]}
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
                                        className={styles["fancy-input"]}
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
                <span onClick={() => props.onShowType(ShowType.SIGN_IN)}><Link to="#">Sign In</Link></span>
            </p>
            <div className="actions">
                <CustomButton caption="Cancel" onClick={props.onClose} type="close"/>
                <CustomButton caption="Sign Up" onClick={handleSignUp} type="sign-up"/>
            </div>
        </>
    );
}