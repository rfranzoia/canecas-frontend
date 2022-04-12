import {Card, Form, Modal} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {Link, useHistory} from "react-router-dom";
import {usersApi} from "../../api/UsersAPI";
import {useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {Role} from "../../domain/User";

export const enum ShowType { SIGN_IN, SIGN_UP}

export const UserRegistration = (props) => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showType, setShowType] = useState(ShowType.SIGN_IN);

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
        if (res.email) {
            appCtx.addUser({
                userId: res._id,
                userEmail: res.email,
                authToken: res.authToken,
                role: res.role
            });
            props.handleClose();
            history.replace("/");
        } else {
            appCtx.handleAlert(true, AlertType.DANGER, res?.name, res?.description);
        }
    }

    const handleSignUp = async () => {
        if (!isDataValid()) return;

        const user = {
            role: Role.USER,
            name: userRegister.name,
            email: userRegister.email,
            password: userRegister.password,
            phone: userRegister.phone,
            address: userRegister.address,
        };
        
        const res = await usersApi.create(user);
        
        if (res.email && res.email === userRegister.email) {
            handleShowType(ShowType.SIGN_IN);

        } else {
            appCtx.handleAlert(true, AlertType.DANGER, res?.name, res?.description);
        }
    }

    const isDataValid = (): boolean => {
        const {name, email, password, confirmPassword, phone} = userRegister;

        if (name.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 ||
            phone.trim().length === 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Name, Email, Phone and Password are required!");
            return false;
        }

        if (password !== confirmPassword) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Password and Password confirmation don't match!");
            return false;
        }

        return true;
    }

    const handleHideError = () => {
        appCtx.handleAlert(false);
    }

    const handleChangeRegister = (event) => {
        const {name, value} = event.target;
        setUserRegister((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleChangeLogin = (event) => {
        const {name, value} = event.target;
        handleHideError();
        setUser(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const formSignIn = (
        <Card>
            <Card.Header>Sign In</Card.Header>
            <Card.Body>
                {appCtx.alert.show && <AlertToast/>}
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
                <div>
                    <CustomButton caption="Cancel" onClick={props.handleClose} type="close"/>
                    &nbsp;
                    <CustomButton caption="Sign In" onClick={() => handleSignIn(user)} type="sign-in"/>
                    <p className="forgot-password text-right">
                        Need an account?&nbsp;
                        <span onClick={() => handleShowType(ShowType.SIGN_UP)}><Link to="#">Sign Up</Link></span>
                    </p>
                </div>
            </Card.Body>
        </Card>
    )

    useEffect(() => {
        setShowType(props.showType);
    }, [props.showType]);

    const formSignUp = (
        <Card>
            <Card.Header>Sign Up</Card.Header>
            <Card.Body>
                {appCtx.alert.show && <AlertToast/>}
                <form>
                    <div className="form-group spaced-form-group">
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
                    </div>
                    <div className="form-group spaced-form-group">
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
                    </div>
                    <div className="form-group spaced-form-group" style={{display: "flex", marginBottom: "1rem"}}>
                        <div style={{float: "left", width: "20rem"}}>
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
                        </div>
                        &nbsp;
                        <div style={{float: "left", width: "20rem"}}>
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
                        </div>
                    </div>
                    <div className="form-group spaced-form-group">
                        <label>Phone<span aria-hidden="true"
                                          className="required">*</span></label>
                        <input
                            type="text"
                            className="form-control bigger-input"
                            placeholder="Phone"
                            name="phone"
                            value={userRegister.phone}
                            onChange={handleChangeRegister}
                        />
                        <small>This is how we'll mainly contact you</small>
                    </div>
                    <div className="form-group spaced-form-group">
                        <label>Address</label>
                        <input
                            type="address"
                            className="form-control bigger-input"
                            placeholder="Address"
                            name="address"
                            value={userRegister.address}
                            onChange={handleChangeRegister}
                        />
                    </div>
                    <br/>
                </form>
                <div>
                    <CustomButton caption="Cancel" onClick={props.handleClose} type="close"/>
                    &nbsp;
                    <CustomButton caption="Sign Up" onClick={handleSignUp} type="sign-up"/>
                </div>
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)<br/>
                    Already registered&nbsp;
                    <span onClick={() => handleShowType(ShowType.SIGN_IN)}><Link to="#">Sign In</Link></span>
                </p>
            </Card.Body>
        </Card>
    )

    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={true} centered>
            <Modal.Body>
                {showType === ShowType.SIGN_IN && formSignIn}
                {showType === ShowType.SIGN_UP && formSignUp}
            </Modal.Body>
        </Modal>
    );
}