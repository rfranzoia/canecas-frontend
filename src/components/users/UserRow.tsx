import {useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiLockOpen, BiTrash} from "react-icons/all";

export const UserRow = (props) => {
    const user = props.user;
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = () => {
        setShowConfirmation(true);
    }

    const handleClose = () => {
        setShowConfirmation(false);
    }

    const handleConfirm = () => {
        setShowConfirmation(false);
        props.onDelete(user);
    }

    const handleChangePassword = () => {
        props.onChangePassword(user.email);
    }

    return (
        <tr key={user._id} style={{ verticalAlign: "middle" }}>
            <td>{user.role}</td>
            <td>{user.name}</td>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", user._id)}>{user.email}</span></td>
            <td align="right">{user.phone}</td>
            <td>{user.address}</td>
            <td align="center">
                <BiEdit
                    onClick={() => props.onEdit("edit", user._id)}
                    title="Editar Usuário"
                    size="2em"
                    cursor="pointer"
                    color="blue"/>
                <span> | </span>
                <BiTrash
                    onClick={handleDelete}
                    title="Remover Usuário"
                    size="2em"
                    cursor="pointer"
                    color="red"/>
                <BiLockOpen
                    onClick={handleChangePassword}
                    title="Atualizar Senha"
                    size="2em"
                    cursor="pointer"
                    color="green"/>
            </td>
            <ConfirmModal show={showConfirmation} handleClose={handleClose} handleConfirm={handleConfirm}
                title="Remover Usuário"  message={`Tem certeza que deseja REMOVER o Usuário '${user.name}'?`}/>
        </tr>
    );
}