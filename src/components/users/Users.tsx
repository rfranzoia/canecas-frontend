import {useCallback, useContext, useEffect, useState} from "react";
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
import {useHistory} from "react-router-dom";

export const Users = () => {
    const appCtx = useContext(ApplicationContext);
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: "",
    });

    const {handleAlert, getToken} = appCtx;

    const loadData = useCallback(async () => {
        const result = await usersApi.withToken(getToken()).list();
        if (result.statusCode === StatusCodes.OK) {
            setUsers(result.data);
        } else if (result.statusCode === StatusCodes.UNAUTHORIZED) {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            history.replace("/");
        } else {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            setShowAlert(true);
            setUsers([]);
        }
    }, [getToken, handleAlert, history]);

    const handleDelete = (success, message?) => {
        loadData().then(() => undefined);
        if (success) {
            handleAlert(true, AlertType.WARNING, "Delete User!", message);
            setShowAlert(true);
        }
    }

    const handleChangePasswordSave = (success, message?) => {
        loadData().then(() => undefined);
        setShowChangePassword(false);
        if (success) {
            handleAlert(true, AlertType.SUCCESS, "Password Change", message);
            setShowAlert(true);
        }
    }

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            handleAlert(true, AlertType.DANGER, error.name, error.description);
            setShowAlert(true);
        }
        loadData().then(undefined);
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
        loadData().then(undefined);
    }, [loadData]);

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    }, [appCtx.alert.show])

    return (
        <div>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark">
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
                    onClose={handleCloseEditModal}>
                    <div>
                        <EditUser id={editViewOp.userId}
                                  op={editViewOp.op}
                                  onCloseModal={handleCloseEditModal}
                        />
                    </div>
                </Modal>
            }
            {showChangePassword &&
                <Modal
                    onClose={handleChangePasswordCancel}>
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


