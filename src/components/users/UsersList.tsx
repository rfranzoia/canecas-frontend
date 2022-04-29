import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { usersApi } from "../../api/UsersAPI";
import { User } from "../../domain/User";
import { RootState } from "../../store";
import { UserRow } from "./UserRow";

export const UsersList = (props) => {
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleChangePassword = (email) => {
        props.onChangePassword(email);
    }

    const handleOnDelete = async (user) => {
        if (!loggedUser.authToken) {
            return;
        }

        const result = await usersApi.withToken(loggedUser.authToken).delete(user._id);
        if (result === null) {
            props.onDelete(true, `User '${user.name}' deleted successfully`);

        } else {
            props.onDelete(false);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th style={{width: "5%"}}>Role</th>
                <th style={{width: "20%"}}>Name</th>
                <th style={{width: "20%"}}>Email</th>
                <th style={{width: "15%"}}>Phone</th>
                <th style={{width: "15%"}}>Address</th>
                <th style={{width: "10%"}}>&nbsp;</th>
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