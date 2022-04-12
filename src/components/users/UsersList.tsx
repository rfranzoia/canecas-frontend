import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {usersApi} from "../../api/UsersAPI";
import {UserRow} from "./UserRow";
import {StatusCodes} from "http-status-codes";

export const UsersList = (props) => {
    const appCtx = useContext(ApplicationContext)

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleChangePassword = (email) => {
        props.onChangePassword(email);
    }

    const handleOnDelete = async (user) => {
        const result = await usersApi.withToken(appCtx.userData.authToken).delete(user._id);
        if (result === null) {
            props.onDelete(true, `User '${user.name}' deleted successfully`);

        } else if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
            appCtx.showErrorAlert(result.name, result.description);

        } else {
            props.onDelete(false);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th style={{ width: "5%" }}>Perfil</th>
                <th style={{ width: "20%" }}>Nome</th>
                <th style={{ width: "20%" }}>Email</th>
                <th style={{ width: "15%" }}>Telefone</th>
                <th style={{ width: "15%" }}>Endereço</th>
                <th style={{ width: "10%" }}>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.users.length > 0 && props.users.map(user => (
                <UserRow key={user._id}
                         user={user}
                         onEdit={handleOnEdit}
                         onDelete={handleOnDelete}
                         onPasswordUpdate={handleChangePassword}
                         onChangePassword={handleChangePassword}/>
            ))}
            </tbody>
        </Table>
    )
}