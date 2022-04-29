import {Alert, Card, Col, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {CustomButton} from "../ui/CustomButton";
import {usersApi} from "../../api/UsersAPI";
import {StatusCodes} from "http-status-codes";

import styles from "./users.module.css"
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {User} from "../../domain/User";

export const ChangeUserPassword = (props) => {
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);

    const [showError, setShowError] = useState({
        show: false,
        title: "",
        message: ""
    });
    const [user, setUser] = useState({
        email: "",
        password: "",
        newPassword: "",
        confirmNewPassword: ""
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        handleHideError();
        setUser(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleHideError = () => {
        setShowError({
            show: false,
            title: "",
            message: ""
        })
    }

    const handleConfirm = () => {

        if (user.newPassword.trim().length === 0 || user.confirmNewPassword.trim().length === 0) {
            setShowError({
                show: true,
                title: "Validation Error!",
                message: "New Password can't be empty"
            });
            return;
        }

        if (user.newPassword !== user.confirmNewPassword) {
            setShowError({
                show: true,
                title: "Validation Error!",
                message: "New password and confirmation don't match"
            });
            return;
        }

        usersApi.withToken(loggedUser.authToken)
            .updatePassword(props.email, user.password, user.newPassword)
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    setShowError({
                        show: true,
                        title: result.name,
                        message: result.description
                    });

                } else {
                    props.onSave(true, "User password has been changed successfully");
                }
            })
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
            <Card className={styles["registration-width-signup"]}>
                <Card.Header as="h3">Change Password</Card.Header>
                {showError.show &&
                    <Alert variant="danger" onClose={handleHideError} dismissible transition  className="alert-top">
                        <Alert.Heading>{showError.title}</Alert.Heading>
                        <p>{showError.message}</p>
                    </Alert>
                }
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