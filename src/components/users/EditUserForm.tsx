import {useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {Role} from "../../domain/User";

export const EditUserForm = (props) => {
    const appCtx = useContext(ApplicationContext);
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
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Role, Name, Email and Password are required!");
            return false;
        }

        if (!isEdit) {
            if (password !== confirmPassword) {
                appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Password and Password confirmation don't match!");
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
            <div>
                <AlertToast />
                <Card border="dark">
                    <Card.Header as="h3">{`${title} User`}</Card.Header>
                    <Card.Body>
                        <form>
                            <div className="form-group spaced-form-group" >
                                <label>Role<span aria-hidden="true" className="required">*</span></label>
                                <select
                                    className="form-select"
                                    id="role"
                                    name="role"
                                    required
                                    value={formData.role}
                                    disabled={viewOnly || formData.role !== Role.ADMIN}
                                    onChange={handleChange}>
                                    <option value="">Please Select</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                    <option value="GUEST">Guest</option>
                                </select>
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Name<span aria-hidden="true" className="required">*</span></label>
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
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Email address<span aria-hidden="true" className="required">*</span></label>
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
                            </div>
                            {(!viewOnly && !isEdit) &&
                                (
                                    <div className="form-group spaced-form-group" style={{display: "flex"}}>
                                        <div style={{float: "left", width: "20rem"}}>
                                            <label>Password<span aria-hidden="true" className="required">*</span></label>
                                            <input
                                                required
                                                type="password"
                                                className="form-control bigger-input"
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
                                                className="form-control bigger-input"
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
                            <div className="form-group spaced-form-group" >
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control bigger-input"
                                    placeholder="Phone"
                                    name="phone"
                                    value={formData.phone}
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group spaced-form-group" >
                                <label>Address</label>
                                <input
                                    type="address"
                                    className="form-control bigger-input"
                                    placeholder="Address"
                                    name="address"
                                    value={formData.address}
                                    disabled={viewOnly}
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

