import {Alert, Card, Form} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {CustomButton} from "../ui/CustomButton";
import {usersApi} from "../../api/UsersAPI";
import {StatusCodes} from "http-status-codes";

export const ChangeUserPassword = (props) => {
    const appCtx = useContext(ApplicationContext);
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

        usersApi.updatePassword(props.email, user.password, user.newPassword)
            .then(result => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);

                } else if (result.statusCode && result.statusCode === StatusCodes.BAD_REQUEST) {
                    setShowError({
                        show: true,
                        title: result.name,
                        message: result.description
                    });

                } else {
                    props.onSave();
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
            <Card>
                <Card.Header as="h3">Change Password</Card.Header>
                {showError.show &&
                    <Alert variant="danger" onClose={handleHideError} dismissible transition  className="alert-top">
                        <Alert.Heading>{showError.title}</Alert.Heading>
                        <p>{showError.message}</p>
                    </Alert>
                }
                <Form>
                    <div style={{margin: "0.5rem"}}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={props.email}
                                disabled
                                onChange={handleChange}/>
                        </Form.Group>
                    </div>
                    <div style={{margin: "0.5rem"}}>
                        <Form.Group>
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={user.password}
                                placeholder="Enter your current password"
                                onChange={handleChange}/>
                        </Form.Group>
                    </div>
                    <div style={{margin: "0.5rem"}}>
                        <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={user.newPassword}
                                placeholder="Enter a new password"
                                onChange={handleChange}/>
                        </Form.Group>
                    </div>
                    <div style={{margin: "0.5rem"}}>
                        <Form.Group>
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmNewPassword"
                                value={user.confirmNewPassword}
                                placeholder="Please re-enter your new password"
                                onChange={handleChange}/>
                        </Form.Group>
                    </div>
                </Form>
            </Card>
            <div style={{padding: "0.5rem"}}>
                <CustomButton caption="Cancel" onClick={props.onCancel} type="close"/>
                &nbsp;
                <CustomButton caption="Confirm" onClick={handleConfirm} type="confirm"/>
            </div>
        </>

    );
}