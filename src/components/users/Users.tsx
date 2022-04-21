import {useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {usersApi} from "../../api/UsersAPI";
import {UsersList} from "./UsersList";
import {EditUser} from "./EditUser";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {CustomButton} from "../ui/CustomButton";
import {ChangeUserPassword} from "./ChangeUserPassword";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";

export const Users = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: "",
    });

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

    const handleDelete = (success, message?) => {
        loadData().then(() => undefined);
        if (success) {
            appCtx.handleAlert(true, AlertType.WARNING, "Delete User!", message);
            setShowAlert(true);
        }
    }

    const handleChangePasswordSave = (success, message?) => {
        loadData().then(() => undefined);
        setShowChangePassword(false);
        if (success) {
            appCtx.handleAlert(true, AlertType.SUCCESS, "Password Change", message);
            setShowAlert(true);
        }
    }

    const handleEditUserSave = () => {
        setShowEditModal(false);
    }

    const handleEditUserCancel = () => {
        setShowEditModal(false);
    }

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
            setShowAlert(true);
        }
    };

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            userId: id,
            email: "",
            op: op,
        });
        setShowEditModal(true);
    };

    const handleShowChangePasswordModal = (email) => {
        setEditViewOp({
            userId: "",
            email: email,
            op: "change-password",
        });
        setShowChangePassword(true);
    };

    const handleChangePasswordCancel = () => {
        setShowChangePassword(false);
    };

    useEffect(() => {
        appCtx.checkValidLogin()
            .then(() => undefined);
    }, []);

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

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    }, [appCtx.alert.show])

    return (
        <div className="default-margin">
            {showAlert && <AlertToast/>}
            <Card border="dark" className="align-content-center">
                <Card.Header as="h3">Users</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <CustomButton
                            caption="New User"
                            type="new"
                            customClass="fa fa-user-plus"
                            onClick={() => handleShowEditModal("new")}/>
                    </Card.Title>
                    <UsersList
                        users={users}
                        onDelete={handleDelete}
                        onEdit={handleShowEditModal}
                        onChangePassword={handleShowChangePasswordModal}/>
                </Card.Body>
            </Card>
            {showEditModal &&
                <Modal
                    onClose={handleCloseEditModal}
                    size="sm">
                    <div>
                        <EditUser id={editViewOp.userId}
                                  op={editViewOp.op}
                                  onSaveCancel={handleCloseEditModal}
                                  onSave={handleEditUserSave}
                                  onCancel={handleEditUserCancel}
                        />
                    </div>
                </Modal>
            }
            {showChangePassword &&
                <Modal
                    onClose={handleChangePasswordCancel}
                    size="sm">
                    <div>
                        <ChangeUserPassword email={editViewOp.email}
                                            onCancel={handleChangePasswordCancel}
                                            onSave={handleChangePasswordSave}/>
                    </div>
                </Modal>
            }
        </div>
    );
};


