import { useEffect, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";

import styles from "./users.module.css"

export const ChangeUserPasswordForm = (props) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [user, setUser] = useState({
        email: "",
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        handleHideError();
        setUser(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleHideError = () => {
        dispatch(uiActions.handleAlert({ show: false, }));
    }

    const handleConfirm = () => {
        setShowAlert(false);
        if (user.newPassword.trim().length === 0 || user.confirmNewPassword.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "New Password can't be empty"
            }));
            setShowAlert(true);
            return;
        }

        if (user.newPassword !== user.confirmNewPassword) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "New password and confirmation don't match"
            }));
            setShowAlert(true);
            return;
        }

        props.onChangePassword(props.email, user.password, user.newPassword);

    }

    useEffect(() => {
        setUser({
            email: props.email,
            password: "",
            newPassword: "",
            confirmNewPassword: ""
        })
    }, [props])

    return (
        <>
            {showAlert && <AlertToast showAlert={showAlert}/>}
            <Card className={styles["registration-width-signup"]}>
                <Card.Header as="h3">Change Password</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Form.Group className="spaced-form-group">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={props.email}
                                    disabled
                                    onChange={handleChange}/>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="spaced-form-group">
                                <Form.Label>Current Password
                                    <span aria-hidden="true" className="required">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={user.password}
                                    placeholder="Enter your current password"
                                    onChange={handleChange}/>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>New Password
                                        <span aria-hidden="true" className="required">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="newPassword"
                                        value={user.newPassword}
                                        placeholder="Enter a new password"
                                        onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <Form.Label>Confirm New Password
                                        <span aria-hidden="true" className="required">*</span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmNewPassword"
                                        value={user.confirmNewPassword}
                                        placeholder="Please re-enter your new password"
                                        onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            <p aria-hidden="true" id="required-description">
                <span aria-hidden="true" className="required">*</span>Required field(s)
            </p>
            <div className={"actions"}>
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                <CustomButton caption="Confirm" onClick={handleConfirm} type="confirm"/>
            </div>
        </>

    );
}