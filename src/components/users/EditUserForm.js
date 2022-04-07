import {useEffect, useRef, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Button} from "../ui/Button";

export const EditUserForm = (props) => {
    const user = props.user;
    const [formData, setFormData] = useState({
        role: "",
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [roles, setRoles] = useState([]);
    const roleRef = useRef();
    const nameRef = useRef();
    const emailRef = useRef();
    const phoneRef = useRef();
    const addressRef = useRef();

    const handleSave = (event) => {
        event.preventDefault();
        const user = {
            role: roleRef.current.value,
            name: nameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value,
            address: addressRef.current.value
        }
        props.onSaveUser(user);
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    useEffect(() => {
        setFormData({
            role: user.role,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address
        });
    }, [user.role, user.name, user.email, user.phone, user.address])

    useEffect(() => {
        setRoles([
            {id: "ADMIN", value: "ADMIN"},
            {id: "USER", value: "USER"},
            {id: "GUEST", value: "GUEST"}
        ])
    }, []);

    const viewOnly = props.op === "view";

    return (
        <Container>
            <Row>
                <Col>
                    <form onSubmit={handleSave}>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select className="form-select" id="role" name="role" required ref={roleRef} value={formData.role}
                                    onChange={handleChange} disabled={viewOnly}>
                                <option value="">Please Select</option>
                                {roles.map(role => {
                                    return (<option key={role.id} value={role.value}>{role.value}</option>);
                                })}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input className="form-control" id="name" name="name" required type="text" ref={nameRef}
                                   value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input className="form-control" id="email" name="email" required type="email" ref={emailRef}
                                   value={formData.email} onChange={handleChange} disabled={viewOnly}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input className="form-control" id="phone" name="phone" required type="text" ref={phoneRef}
                                   value={formData.phone} onChange={handleChange} disabled={viewOnly}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address</label>
                            <input className="form-control" id="address" name="address" required type="text" ref={addressRef}
                                   value={formData.address} onChange={handleChange} disabled={viewOnly}/>
                        </div>

                    </form>
                </Col>
            </Row>
            <br/>
            <Row>
                <Col>
                    <div className="align-content-end">
                        {!viewOnly && (
                            <>
                                <Button caption="Save" onClick={handleSave} type="save"/>
                                <span>&nbsp;</span>
                            </>
                        )}
                        <Button caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}