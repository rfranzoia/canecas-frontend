import {Button, Col, Container, Row, Toast} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useRef, useState} from "react";
import {usersApi} from "../../api/UsersAPI";

export const UserRegisterForm = () => {
    const history = useHistory();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        when: ""
    })
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();
    const roleRef = useRef();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }});
    }

    const handleSignUp = async () => {
        const res = await usersApi.create(formData);
        if (res.email && res.email === formData.email) {
            history.replace("/users/login");

        } else {
            setToast({
                show: true,
                message: res.description,
                when: res.name
            });
        }
    }

    const handleCancel = () => {
        history.replace("/");
    }

    const handleCloseToast = () => {
        setToast({
            show: false,
            message: "",
            when: ""
        });
    }

    return (
        <Container fluid="sm">
            <Row className="justify-content-md-center">
                <Col sm={6}>
                    <form>
                        <h3>Sign Up</h3>
                        <div className="form-group">
                            <label>Role</label>
                            <select className="form-select" id="role" name="role" required ref={roleRef} value={formData.role} onChange={handleChange}>
                                <option value="">Please Select</option>
                                <option value="USER">User</option>
                                <option value="GUESt">Guest</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                required
                                type="text"
                                className="form-control"
                                placeholder="Enter your name here"
                                name="name"
                                ref={nameRef}
                                value={formData.name}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                required
                                type="email"
                                className="form-control"
                                placeholder="Enter email for login"
                                name="email"
                                ref={emailRef}
                                value={formData.email}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                required
                                type="password"
                                className="form-control"
                                placeholder="Enter a password"
                                name="password"
                                ref={passwordRef}
                                value={formData.password}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Phone"
                                name="phone"
                                ref={phoneRef}
                                value={formData.phone}
                                onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="address"
                                className="form-control"
                                placeholder="Address"
                                name="address"
                                ref={addressRef}
                                value={formData.address}
                                onChange={handleChange}/>
                        </div>
                        <br/>
                    </form>
                </Col>
                <Row className="justify-content-md-center">
                    <Col sm={6}>
                        <Button variant="primary" onClick={handleSignUp}>Sign Up</Button>
                        &nbsp;
                        <Button variant="danger" onClick={handleCancel}>Cancel</Button>
                        <p className="forgot-password text-right">
                            Already registered <Link to="#">sign in?</Link>
                        </p>
                    </Col>
                </Row>
            </Row>
            <Row className="justify-content-md-center">
                <Col>
                    <Toast show={toast.show} onClose={handleCloseToast} delay={5000} autohide>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                            <strong className="me-auto">User SignUp</strong>
                            <small>{toast.when}</small>
                        </Toast.Header>
                        <Toast.Body>{toast.message}</Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </Container>
    );
}