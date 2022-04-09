import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { CustomButton } from "../ui/CustomButton";

export const EditUserForm = (props) => {
    const user = props.user;
    const viewOnly = props.op === "view";
    const isEdit = props.op === "edit";

    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
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

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message
        });
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
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
            phone: user.phone,
            address: user.address,
        });
    }, [user]);

    return (
        <div style={{ padding: "0.5rem", width: "95%", margin: "auto" }}>
            <div>
                {alert.show && 
                    (
                        <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible>
                            <Alert.Heading>{alert.title}</Alert.Heading>
                            <p>{alert.message}</p>
                        </Alert>
                    )
                }
            </div>
            <form>
                <div className="form-group">
                    <label>Role</label>
                    <select
                        className="form-select"
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}>
                        <option value="">Please Select</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">User</option>
                        <option value="GUEST">Guest</option>
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
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email address</label>
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
                        <div className="form-group">
                            <label>Password</label>
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
                    )
                }
                <div className="form-group">
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
                <div className="form-group">
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
                <br />
            </form>
            <div style={{ padding: "0.5rem", display: "flex", justifyContent: "center" }}>
                <div style={{ alignContent: "center", alignItems: "center" }}>
                    <CustomButton caption={viewOnly?"Close":"Cancel"} onClick={handleCancel} type="close" />
                    {!viewOnly && (
                        <>
                            &nbsp;
                            <CustomButton caption="Save" onClick={handleSave} type="save" />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

