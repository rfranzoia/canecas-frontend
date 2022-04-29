import {useCallback, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {usersApi} from "../../api/UsersAPI";
import {UsersList} from "./UsersList";
import {EditUser} from "./EditUser";
import {StatusCodes} from "http-status-codes";
import {CustomButton} from "../ui/CustomButton";
import {ChangeUserPassword} from "./ChangeUserPassword";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {User} from "../../domain/User";
import {AlertType, uiActions} from "../../store/uiSlice";

export const Users = () => {
    const history = useHistory();
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);
    const dispatch = useDispatch();
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: "",
    });

    const loadData = useCallback(async () => {
        const result = await usersApi.withToken(loggedUser.authToken).list();
        if (result.statusCode === StatusCodes.OK) {
            setUsers(result.data);
        } else if (result.statusCode === StatusCodes.UNAUTHORIZED) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.DANGER, title:result.name, message:result.description}));
            history.replace("/");
        } else {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.DANGER, title:result.name, message:result.description}));
            setShowAlert(true);
            setUsers([]);
        }
    }, [loggedUser.authToken, dispatch, history]);

    const handleDelete = (success, message?) => {
        loadData().then(() => undefined);
        if (success) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.WARNING, title:"Delete User!", message:message}));
            setShowAlert(true);
        }
    }

    const handleChangePasswordSave = (success, message?) => {
        loadData().then(() => undefined);
        setShowChangePassword(false);
        if (success) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.SUCCESS, title:"Password Change", message:message}));
            setShowAlert(true);
        }
    }

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.DANGER, title:error.name, message:error.description}));
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


