import {Button, Modal} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useRef, useState} from "react";
import {usersApi} from "../../api/UsersAPI";
import {ApplicationContext} from "../../store/application-context";

export const UserLoginModal = (props) => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showError, setShowError] = useState({
        show: false,
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
        setShowError({
            show: false,
            message: ""
        });
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
                userEmail: res.email,
                authToken: res.authToken,
            });
            props.handleClose();
            history.replace("/");
        } else {
            setShowError({
                show: true,
                message: `${res?.name}: ${res?.description}`
            })
        }

    }

    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showError.show && <h5>{showError.message}</h5>}
                <form>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            required
                            type="email"
                            className="form-control"
                            placeholder="Enter email"
                            name="email"
                            ref={emailRef}
                            value={user.email}
                            onChange={handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            required
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            name="password"
                            ref={passwordRef}
                            value={user.password}
                            onChange={handleChange}/>
                    </div>
                    <p className="forgot-password text-right">
                        Need an account?
                        <span onClick={handleSignup}><Link to="#">Signup</Link></span>
                    </p>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>Cancel</Button>
                <Button variant="primary" onClick={() => handleLogin(user)}>Login</Button>
            </Modal.Footer>
        </Modal>
    );
}