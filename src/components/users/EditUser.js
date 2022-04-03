import {usersApi} from "../../api/UsersAPI";
import {EditUserForm} from "./EditUserForm";
import {useContext, useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import {ApplicationContext} from "../../store/application-context";

export const EditUser = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [user, setUser] = useState({
        name: "",
        description: "",
        price: 0,
        type: ""
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
                const p = await usersApi.get(props.id);
                setUser(p);
            } else {
                setUser({
                    name: "",
                    description: "",
                    price: 0,
                    type: ""
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, props.op]);

    const title = props.op === "new" ? "New" :
                    props.op === "edit" ? "Edit" : "View";

    const handleOp = (user) => {
        if (props.op !== "view") {
            handleSaveUser(user);
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col sm={2}></Col>
                <Col md="auto">
                    <Card border="dark" className="align-content-center" style={{ width: '46.5rem'}}>
                        <Card.Header as="h2">{`${title} User`}</Card.Header>
                        <Card.Body>
                            <EditUserForm user={user} op={props.op} onSaveUser={handleOp} onCancel={handleCancel}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </Container>

    );
}