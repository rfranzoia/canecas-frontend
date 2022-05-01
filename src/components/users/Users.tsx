import { useState } from "react";
import { Card } from "react-bootstrap";
import { User } from "../../domain/User";
import useUsersApi from "../../hooks/useUsersApi";
import { OpType } from "../../store";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import Modal from "../ui/Modal";
import { ChangeUserPasswordForm } from "./ChangeUserPasswordForm";
import { EditUser } from "./EditUser";
import { UsersList } from "./UsersList";

export const Users = () => {
    const { users, list, remove, changePassword } = useUsersApi();
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        userId: "",
        email: "",
        op: "",
    });

    const handleDelete = async (user: User) => {
        const result = await remove(user);
        result();
        setShowAlert(true);
    }

    const handleChangePassword = async (email: string, password: string, newPassword: string) => {
        const result = await changePassword(email, password, newPassword);
        result();
        setShowChangePassword(false);
        setShowAlert(true);
    }

    const handleCloseEditModal = async (success?: boolean) => {
        setShowEditModal(false);
        if (success) {
            await list();
        }
    };

    const handleShowNewUserModal = () => {
        setEditViewOp({
            userId: "",
            email: "",
            op: OpType.NEW,
        })
        setShowAlert(false);
        setShowEditModal(true);
    }

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
        setShowAlert(false);
        setShowChangePassword(true);
    };

    const handleChangePasswordCancel = () => {
        setShowChangePassword(false);
    };

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
                            onClick={handleShowNewUserModal}/>
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
                        <ChangeUserPasswordForm email={editViewOp.email}
                                                onCancel={handleChangePasswordCancel}
                                                onChangePassword={handleChangePassword}
                        />
                    </div>
                </Modal>
            }
        </div>
    );
};


