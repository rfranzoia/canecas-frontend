import {Alert, Button, Form, Modal} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useRef, useState} from "react";
import {usersApi} from "../../api/UsersAPI";
import {ApplicationContext} from "../../context/ApplicationContext";

export const UserLoginForm = (props) => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showError, setShowError] = useState({
        show: false,
        title: "",
        message: ""
    });
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleChange = (event) => {
        const {name, value} = event.target;
        handleHideError();
        setUser(prevState => {
            return {
                ...prevState,
                [name]: value
            }});
    }

    const handleSignup = () => {
        props.handleClose();
        history.replace("/users/create");
    }

    const handleLogin = async (credentials) => {
        const res = await usersApi.login(credentials.email, credentials.password);
        if (res.email) {
            appCtx.addUser({
                userId: res._id,
                userEmail: res.email,
                authToken: res.authToken,
            });
            props.handleClose();
            history.replace("/");
        } else {
            setShowError({
                show: true,
                title: res?.name,
                message: res?.description
            })
        }

    }

    const handleHideError = () => {
        setShowError({
            show: false,
            title: "",
            message: ""
        })
    }

    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showError.show &&
                    <Alert variant="danger" onClose={handleHideError} dismissible>
                        <Alert.Heading>{showError.title}</Alert.Heading>
                        <p>{showError.message}</p>
                    </Alert>
                }
                <Form>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                        type="email"
                        name="email"
                        ref={emailRef}
                        value={user.email}
                        placeholder="Enter your e-mail address"
                        onChange={handleChange}/>
                    </Form.Group>
                    <br/>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            ref={passwordRef}
                            value={user.password}
                            placeholder="Enter you password"
                            onChange={handleChange}/>
                    </Form.Group>
                    <p className="forgot-password text-right">
                        Need an account?
                        <span onClick={handleSignup}><Link to="#">Signup</Link></span>
                    </p>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>Cancel</Button>
                <Button variant="primary" onClick={() => handleLogin(user)}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
}