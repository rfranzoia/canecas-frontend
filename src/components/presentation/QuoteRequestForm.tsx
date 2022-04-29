import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { usersApi } from "../../api/UsersAPI";
import { Role } from "../../domain/User";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { DefaultCard } from "../ui/DefaultCard";

export const QuoteRequestForm = (props) => {
    const dispatch = useDispatch();
    const [showAlert, setShowAlert] = useState(false);
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleConfirm = async () => {
        if (!isValidData()) return;
        const user = {
            ...formData,
            password: "password",
            role: Role.GUEST
        }
        const res = await usersApi.create(user);
        if (res.email && res.email === formData.email) {
            props.onConfirm();
        } else {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: res.name,
                message: res.description
            }));
        }
    }

    const isValidData = () => {
        const { name, phone, email } = formData;
        if (name.trim().length === 0 || phone.trim().length === 0 ||
            email.trim().length === 0) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: "Validation Error!",
                message: "All fields are required"
            }));
            setShowAlert(true);
            return false;
        }
        return true;
    }

    const handleCancel = () => {
        props.onCancel();
    }

    return (
        <Container style={{ justifyContent: "center" }}>
            <Row>
                <Col>
                    <AlertToast showAlert={showAlert}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ padding: "0.5rem", display: "flex", justifyContent: "center" }}>
                        <DefaultCard title="Request Quote" style={{ width: "30rem" }}>
                            <form>
                                <div className="form-group spaced-form-group">
                                    <label>Name<span aria-hidden="true"
                                                     className="required">*</span></label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control bigger-input"
                                        placeholder="Enter your name here"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}/>
                                </div>
                                <div className="form-group spaced-form-group">
                                    <label>Email<span aria-hidden="true"
                                                      className="required">*</span></label>
                                    <input
                                        required
                                        type="email"
                                        className="form-control bigger-input"
                                        placeholder="Enter email for login"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}/>
                                    <small>This will be your login information</small>
                                </div>
                                <div className="form-group spaced-form-group">
                                    <label>Phone<span aria-hidden="true"
                                                      className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control bigger-input"
                                        placeholder="Please enter you Phone number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}/>
                                    <small>This is how we'll mainly contact you</small>
                                </div>
                                <br/>
                            </form>
                            <div className="align-content-end">
                                <CustomButton caption="Request" onClick={handleConfirm} type="save"/>
                                <span>&nbsp;</span>
                                <CustomButton caption="Cancel" onClick={handleCancel} type="close"/>
                                <p aria-hidden="true" id="required-description">
                                    <span aria-hidden="true" className="required">*</span>Required field(s)
                                </p>
                            </div>
                        </DefaultCard>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}