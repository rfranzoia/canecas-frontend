import {usersApi} from "../../api/UsersAPI";
import {EditUserForm} from "./EditUserForm";
import {useContext, useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";

export const EditUser = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [user, setUser] = useState({
        role: "",
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleSaveUser = (user) => {
        const callback = async (user) => {
            if (props.op === "edit") {
                await usersApi.withToken(appCtx.userData.authToken).update(props.id, user)
            } else if (props.op === "new") {
                await usersApi.withToken(appCtx.userData.authToken).create(user);
            }
        }
        callback(user)
            .then(() => props.onSaveCancel());

    }

    const handleCancel = () => {
        props.onSaveCancel();
    }

    useEffect(() => {
        const callback = async () => {
            if (props.op === "edit" || props.op === "view") {
                const p = await usersApi.withToken(appCtx.userData.authToken).get(props.id);
                setUser(p);
            } else {
                setUser({
                    role: "",
                    name: "",
                    email: "",
                    phone: "",
                    address: ""
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, props.op, appCtx.userData.authToken]);

    const title = props.op === "new" ? "New" :
                    props.op === "edit" ? "Edit" : "View";

    const handleOp = (user) => {
        if (props.op !== "view") {
            handleSaveUser(user);
        }
    }

    return (
        <Container fluid style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <Row>
                <Col md="auto">
                    <Card border="dark" className="align-content-center" style={{ width: '46.5rem'}}>
                        <Card.Header as="h3">{`${title} User`}</Card.Header>
                        <Card.Body>
                            <EditUserForm user={user} op={props.op} onSaveUser={handleOp} onCancel={handleCancel}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}