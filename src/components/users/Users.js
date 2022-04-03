import {useContext, useEffect, useState} from "react";
import {Button, Card, Col, Container, Modal, Row, Toast} from "react-bootstrap";
import {usersApi} from "../../api/UsersAPI";
import {UsersList} from "./UsersList";
import {EditUser} from "./EditUser";
import {ApplicationContext} from "../../context/ApplicationContext";

export const Users = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        op: ""
    });

    const TOAST_TIMEOUT = 3 * 1000;

    useEffect(() => {
        usersApi.withToken(appCtx.userData.authToken).list()
            .then(data => {
                setUsers(data);
            });
    }, [showEditModal, appCtx.userData.authToken])

    const handleNewUser = () => {
        handleShowEditModal("new")
    }

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            usersApi.withToken(appCtx.userData.authToken).list()
                .then(data => {
                    setUsers(data);
                    setShowToast(show);
                });
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            userId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    return (
            <Container fluid style={{ padding: "0.5rem", display: "flex", justifyContent: "center" }}>
                <Row>
                    <Col>
                        <Card border="dark" className="align-content-center" style={{width: '100rem'}}>
                            <Card.Header as="h3">Users</Card.Header>
                            <Card.Body>
                                <Card.Title>
                                    <Button
                                        variant="success"
                                        onClick={() => handleNewUser("new")}>New User
                                    </Button>
                                </Card.Title>
                                <UsersList users={users} onDelete={handleShowToast}
                                              onEdit={handleShowEditModal}/>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Toast show={showToast} onClose={handleCloseToast} delay={TOAST_TIMEOUT} autohide>
                            <Toast.Header>
                                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                                <strong className="me-auto">Users</strong>
                                <small>just now</small>
                            </Toast.Header>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                    </Col>
                </Row>
                <Row>
                    <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static" keyboard={true} size="lg"
                           className="align-content-center">
                        <Modal.Body>
                            <EditUser id={editViewOp.userId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                        </Modal.Body>
                        <Modal.Footer>
                        </Modal.Footer>
                    </Modal>
                </Row>
            </Container>

    );
}