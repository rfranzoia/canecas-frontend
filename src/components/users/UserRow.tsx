import { useState } from "react";
import { BiEdit, BiLockOpen, BiTrash } from "react-icons/bi";
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

    return (
        <tr key={user._id} style={{verticalAlign: "middle"}}>
            <td>{user.role}</td>
            <td>{user.name}</td>
            <td><span style={{cursor: "pointer", color: "blue"}}
                      onClick={() => props.onEdit("view", user._id)}>{user.email}</span></td>
            <td align="right">{user.phone}</td>
            <td>{user.address}</td>
            <td align="center">
                <BiEdit
                    onClick={() => props.onEdit("edit", user._id)}
                    title="Edit User"
                    size="2em"
                    cursor="pointer"
                    color="blue"/>
                <span> | </span>
                <BiTrash
                    onClick={handleShowDeleteConfirmation}
                    title="Delete User"
                    size="2em"
                    cursor="pointer"
                    color="red"/>
                <BiLockOpen
                    onClick={handleChangePassword}
                    title="Update Password"
                    size="2em"
                    cursor="pointer"
                    color="green"/>
            </td>
            <ConfirmModal show={showConfirmation} handleClose={handleHideDeleteConfirmation}
                          handleConfirm={handleConfirmDelete}
                          title="Delete User" message={`Are you sure you want to delete the user '${user.name}'?`}/>
        </tr>
    );
}