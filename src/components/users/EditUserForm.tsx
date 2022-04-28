import {useContext, useEffect, useState} from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {Role} from "../../domain/User";

import styles from "./users.module.css"

export const EditUserForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const user = props.user;
    const viewOnly = props.op === "view";
    const isEdit = props.op === "edit";

    const {handleAlert} = appCtx;

    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const handleSave = (event) => {
        event.preventDefault();
        if (!isDataValid()) return;

        const user = {
            role: formData.role,
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
        };

        props.onSaveUser(user);
    };

    const isDataValid = (): boolean => {
        const {role, name, email, password, confirmPassword} = formData;

        if (role.trim().length === 0 || name.trim().length === 0 ||
            email.trim().length === 0 || password.trim().length === 0) {
            handleAlert(true, AlertType.DANGER, "Validation Error", "Role, Name, Email and Password are required!");
            setShowAlert(true);
            return false;
        }

        if (!isEdit) {
            if (password !== confirmPassword) {
                handleAlert(true, AlertType.DANGER, "Validation Error", "Password and Password confirmation don't match!");
                setShowAlert(true);
                return false;
            }
        }

        return true;
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    };

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };


    useEffect(() => {
        setFormData({
            role: user.role,
            name: user.name,
            email: user.email,
            password: user.password,
            confirmPassword: user.password,
            phone: user.phone,
            address: user.address,
        });
    }, [user]);

    const title = props.op === "new" ? "New" : props.op === "edit" ? "Edit" : "View";

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark" className={styles["registration-width-signup"]}>
                <Card.Header as="h3">{`${title} User`}</Card.Header>
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={"auto"}>
                                <Form.Group className="spaced-form-group">
                                    <label>Role
                                        <span aria-hidden="true" className="required">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="role"
                                        name="role"
                                        required
                                        value={formData.role}
                                        disabled={viewOnly || appCtx.userData.role !== Role.ADMIN}
                                        onChange={handleChange}>
                                        <option value="">Please Select</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="USER">User</option>
                                        <option value="GUEST">Guest</option>
                                    </select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Name
                                        <span aria-hidden="true" className="required">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="form-control bigger-input"
                                        placeholder="Enter your name here"
                                        name="name"
                                        value={formData.name}
                                        disabled={viewOnly}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Form.Group className="spaced-form-group">
                                <label>Email address
                                    <span aria-hidden="true" className="required">*</span>
                                </label>
                                <input
                                    required
                                    type="email"
                                    className="form-control bigger-input"
                                    placeholder="Enter email for login"
                                    name="email"
                                    value={formData.email}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>
                        {(!viewOnly && !isEdit) &&
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label>Password
                                            <span aria-hidden="true" className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control bigger-input"
                                            placeholder="Enter a password"
                                            name="password"
                                            disabled={viewOnly || isEdit}
                                            value={formData.password}
                                            autoComplete={"off"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <label>Confirm Password
                                            <span aria-hidden="true" className="required">*</span>
                                        </label>
                                        <input
                                            required
                                            type="password"
                                            className="form-control bigger-input"
                                            placeholder="Confirm your password"
                                            name="confirmPassword"
                                            disabled={viewOnly || isEdit}
                                            value={formData.confirmPassword}
                                            autoComplete={"off"}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        }

                        <Row>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Phone
                                        <span aria-hidden="true" className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control bigger-input"
                                        placeholder="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        disabled={viewOnly}
                                        autoComplete={"off"}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="spaced-form-group">
                                    <label>Address</label>
                                    <input
                                        type="address"
                                        className="form-control bigger-input"
                                        placeholder="Address"
                                        name="address"
                                        value={formData.address}
                                        disabled={viewOnly}
                                        autoComplete={"off"}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
            { !viewOnly &&
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            }
            <div className="actions">
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
            </div>
        </>
    );
};

