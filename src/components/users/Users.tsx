import { useContext, useEffect, useState } from "react";
import { Alert, Card, Modal} from "react-bootstrap";
import { usersApi } from "../../api/UsersAPI";
import { UsersList } from "./UsersList";
import { EditUser } from "./EditUser";
import {ALERT_TIMEOUT, ApplicationContext} from "../../context/ApplicationContext";
import { StatusCodes } from "http-status-codes";
import { CustomButton } from "../ui/CustomButton";
import { ChangeUserPassword } from "./ChangeUserPassword";

export const Users = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: "",
    });
    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: ""
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
        }, ALERT_TIMEOUT)}
    };

    const loadData = async () => {
        if (!appCtx.userData.authToken) return;
        const result = await usersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
            appCtx.showErrorAlert(result.name, result.description);
            setUsers([]);
        } else {
            setUsers(result);
        }
    };

    const handleDelete = () => {
        loadData().then(() => undefined);
        handleAlert(true, "warning", "Delete User!", "User has been deleted successfully")
    }

    const handlePasswordChanged = () => {
        loadData().then(() => undefined);
        setShowChangePassword(false);
        handleAlert(true, "success", "Password Update", "User password has been updated successfully")
    }

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            userId: id,
            email: "",
            op: op,
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            handleAlert(true, "danger", error.name, error.description);
        }
    };

    const handleShowChangePasswordModal = (email) => {
        setEditViewOp({
            userId: "",
            email: email,
            op: "change-password",
        });
        setShowChangePassword(true);
    };

    const handleClosePasswordModal = () => {
        setShowChangePassword(false);
    };

    useEffect(() => {
        if (!appCtx.userData.authToken) {
            setUsers([]);
            return;
        }
        usersApi
            .withToken(appCtx.userData.authToken)
            .list()
                .then((result) => {
                    if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                        appCtx.showErrorAlert(result.name, result.description);
                        setUsers([]);
                    } else {
                        setUsers(result);
                    }
                });
    }, [appCtx, showEditModal]);

    return (
        <div className="container4">       
            {alert.show && 
            (
                <div className="alert-top">
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            )}
            <div>
                <Card border="dark" className="align-content-center">
                    <Card.Header as="h3">Users</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <CustomButton
                                caption="New User"
                                type="new"
                                customClass="fa fa-user-plus"
                                onClick={() => handleShowEditModal("new")} />
                        </Card.Title>
                        <UsersList
                            users={users}
                            onDelete={handleDelete}
                            onEdit={handleShowEditModal}
                            onChangePassword={handleShowChangePasswordModal}/>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Modal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    backdrop="static"
                    centered
                    style={{ justifyItems: "center", margin: "auto"}}
                    size="lg"
                    keyboard={true}>
                    <Modal.Body>
                        <div className="container4">
                            <EditUser id={editViewOp.userId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <div>
                <Modal
                    show={showChangePassword}
                    onHide={handleClosePasswordModal}
                    backdrop="static"
                    centered
                    keyboard={true}
                    style={{ margin: "auto", alignContent: "center", justifyItems: "center" }}>
                    <Modal.Body>
                        <div className="container4">
                            <ChangeUserPassword email={editViewOp.email} onCancel={handleClosePasswordModal} onSave={handlePasswordChanged}/>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};


