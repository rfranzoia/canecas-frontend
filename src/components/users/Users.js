import {useContext, useEffect, useState} from "react";
import {Card, Col, Container, Modal, Row, Toast} from "react-bootstrap";
import {usersApi} from "../../api/UsersAPI";
import {UsersList} from "./UsersList";
import {EditUser} from "./EditUser";
import {ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {Button} from "../ui/Button";
import {ChangeUserPassword} from "./ChangeUserPassword";

export const Users = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: ""
    });

    const TOAST_TIMEOUT = 3 * 1000;

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            const data = loadData();
            if (data.length > 0) {
                setShowToast(show);
            }
            setUsers(data);
        }
    }

    const loadData = async () => {
        const result = await usersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
            appCtx.showErrorAlert(result.name, result.description);
            setUsers([]);
        } else {
            setUsers(result);
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            userId: id,
            email: "",
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    const handleShowChangePasswordModal = (email) => {
        setEditViewOp({
            userId: "",
            email: email,
            op: "change-password"
        });
        setShowChangePassword(true);
    }

    const handleClosePasswordModal = () => {
        setShowChangePassword(false);
    }

    useEffect(() => {
        usersApi.withToken(appCtx.userData.authToken).list()
            .then(result => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                    setUsers([]);
                } else {
                    setUsers(result);
                }
            });
    }, [appCtx]);

    const customButtonType = {type: "add-user", class: "fa fa-user-plus", color: "#008000", hover: "#005d00"}

    return (
        <Container fluid style={{padding: "0.5rem", display: "flex", justifyContent: "center"}}>
            <Row>
                <Col>
                    <Card border="dark" className="align-content-center" style={{width: '100rem'}}>
                        <Card.Header as="h3">Users</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <Button caption="New User" onClick={() => handleShowEditModal("new")} customType={customButtonType}/>
                            </Card.Title>
                            <UsersList users={users} onDelete={handleShowToast}
                                       onEdit={handleShowEditModal} onChangePassword={handleShowChangePasswordModal}/>
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
                <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static"
                       centered keyboard={true} size="lg">
                    <Modal.Body>
                        <EditUser id={editViewOp.userId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                    </Modal.Body>
                </Modal>
            </Row>
            <Row>
                <Modal show={showChangePassword} onHide={handleClosePasswordModal} backdrop="static"
                       centered keyboard={true} size="md">
                    <Modal.Body>
                        <ChangeUserPassword email={editViewOp.email} onSaveCancel={handleClosePasswordModal}/>
                    </Modal.Body>
                </Modal>
            </Row>
        </Container>

    );
}