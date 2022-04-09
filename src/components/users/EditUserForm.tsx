import {useEffect, useState} from "react";
import {Alert, Card} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {ALERT_TIMEOUT} from "../../context/ApplicationContext";

export const EditUserForm = (props) => {
    const user = props.user;
    const viewOnly = props.op === "view";
    const isEdit = props.op === "edit";

    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: ""
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
            handleAlert(true, "danger", "Validation Error", "Role, Name, Email and Password are required!");
            return false;
        }

        if (!isEdit) {
            if (password !== confirmPassword) {
                handleAlert(true, "danger", "Validation Error", "Password and Password confirmation don't match!");
                return false;
            }
        }

        return true;
    }

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
            }, ALERT_TIMEOUT)
        }
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
            <div>
                {alert.show &&
                    <div>
                        <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                            <Alert.Heading>{alert.title}</Alert.Heading>
                            <p>{alert.message}</p>
                        </Alert>
                    </div>
                }
                <Card border="dark">
                    <Card.Header as="h3">{`${title} User`}</Card.Header>
                    <Card.Body>
                        <form>
                            <div style={{margin: "0 0 1rem"}}>
                                <label>Role<span aria-hidden="true" className="required">*</span></label>
                                <select
                                    className="form-select"
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    onChange={handleChange}>
                                    <option value="">Please Select</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                    <option value="GUEST">Guest</option>
                                </select>
                            </div>
                            <div>
                                <label>Name<span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter your name here"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Email address<span aria-hidden="true" className="required">*</span></label>
                                <input
                                    required
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email for login"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {(!viewOnly && !isEdit) &&
                                (
                                    <div className="form-group" style={{display: "flex"}}>
                                        <div style={{float: "left", width: "20rem"}}>
                                            <label>Password<span aria-hidden="true" className="required">*</span></label>
                                            <input
                                                required
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter a password"
                                                name="password"
                                                disabled={viewOnly || isEdit}
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        &nbsp;
                                        <div style={{float: "left", width: "20rem"}}>
                                            <label>Confirm Password<span aria-hidden="true"
                                                                         className="required">*</span></label>
                                            <input
                                                required
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm your password"
                                                name="confirmPassword"
                                                disabled={viewOnly || isEdit}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                )
                            }
                            <div>
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Address</label>
                                <input
                                    type="address"
                                    className="form-control"
                                    placeholder="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <br/>
                        </form>
                    </Card.Body>
                </Card>
                <br/>
                <div className="align-content-end">
                    {!viewOnly && (
                        <>
                            <CustomButton caption="Save" onClick={handleSave} type="save"/>
                            <span>&nbsp;</span>
                        </>
                    )}
                    <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
                    <p aria-hidden="true" id="required-description">
                        <span aria-hidden="true" className="required">*</span>Required field(s)
                    </p>
                </div>
            </div>
        </>
    );
};

