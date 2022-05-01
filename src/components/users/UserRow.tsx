import { useState } from "react";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { ConfirmModal } from "../ui/ConfirmModal";

export const UserRow = (props) => {
    const user = props.user;
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleShowDeleteConfirmation = () => {
        setShowConfirmation(true);
    }

    const handleHideDeleteConfirmation = () => {
        setShowConfirmation(false);
    }

    const handleConfirmDelete = () => {
        setShowConfirmation(false);
        props.onDelete(user);
    }

    const handleChangePassword = () => {
        props.onChangePassword(user.email);
    }

    const actions =
        <td width="15%" align="right">
            {getActionIcon(ActionIconType.EDIT,
                "Edit User",
                true,
                () => props.onEdit("edit", user._id))}
            {getActionIcon(ActionIconType.DELETE,
                "Remove User",
                true,
                () => handleShowDeleteConfirmation())}
            {getActionIcon(ActionIconType.CHANGE_PASSWORD,
                "Change Password",
                true,
                () => handleChangePassword())}
        </td>

    return (
        <tr key={user._id} style={{ verticalAlign: "middle" }}>
            <td>{user.role}</td>
            <td>{user.name}</td>
            <td><span style={{ cursor: "pointer", color: "blue" }}
                      onClick={() => props.onEdit("view", user._id)}>{user.email}</span></td>
            <td align="right">{user.phone}</td>
            <td>{user.address}</td>
            {actions}
            <ConfirmModal show={showConfirmation}
                          handleClose={handleHideDeleteConfirmation}
                          handleConfirm={handleConfirmDelete}
                          title="Delete User" message={`Are you sure you want to delete the user '${user.name}'?`}/>
        </tr>
    );
}