import {Col, Container, Row, Toast} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useState} from "react";
import {usersApi} from "../../api/UsersAPI";
import {DefaultCard} from "../ui/DefaultCard";
import {CustomButton} from "../ui/CustomButton";

export const UserRegisterForm = () => {
    const history = useHistory();
    const [toast, setToast] = useState({
        show: false,
        message: "",
        when: ""
    });
    
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
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
        <Container style={{justifyContent: "center"}}>
            <Row>
                <Col>
                    <div style={{padding: "0.5rem", display: "flex", justifyContent: "center"}}>
                        <DefaultCard title="Sign Up" style={{width: "30rem"}}>
                            <form>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select className="form-select" id="role" name="role" required
                                            value={formData.role}
                                            onChange={handleChange}>
                                        <option value="">Please Select</option>
                                        <option value="USER">User</option>
                                        <option value="GUESt">Guest</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        required type="text" className="form-control" placeholder="Enter your name here"
                                        name="name" value={formData.name} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Email address</label>
                                    <input
                                        required type="email" className="form-control" placeholder="Enter email for login"
                                        name="email" value={formData.email} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        required type="password" className="form-control" placeholder="Enter a password"
                                        name="password" value={formData.password} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input
                                        type="text" className="form-control" placeholder="Phone"
                                        name="phone" value={formData.phone} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <input
                                        type="address" className="form-control" placeholder="Address"
                                        name="address" value={formData.address} onChange={handleChange}/>
                                </div>
                                <br/>
                            </form>
                            <p className="forgot-password text-right" style={{ textAlign: "center"}}>
                                Already registered <Link to="/users/login">sign in?</Link>
                            </p>
                            <div style={{ alignContent: "center", alignItems: "center"}}>
                                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                                &nbsp;
                                <CustomButton caption="Sign Up" onClick={handleSignUp} type="sign-up"/>
                            </div>
                        </DefaultCard>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Toast show={toast.show} onClose={handleCloseToast} delay={5000} autohide>
                            <Toast.Header>
                                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                                <strong className="me-auto">User SignUp</strong>
                                <small>{toast.when}</small>
                            </Toast.Header>
                            <Toast.Body>{toast.message}</Toast.Body>
                        </Toast>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}