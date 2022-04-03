import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {usersApi} from "../../api/UsersAPI";
import {UserRow} from "./UserRow";

export const UsersList = (props) => {
    const appCtx = useContext(ApplicationContext);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleOnDelete = async (user) => {
        if (await usersApi.withToken(appCtx.userData.authToken).delete(user._id)) {
            props.onDelete(true, `User '${user.name}' deleted successfully`);
        } else {
            props.onDelete(false);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th width="20%">Name</th>
                <th width="20%">Email</th>
                <th width="15%">Phone</th>
                <th width="15%">Address</th>
                <th width="5%">&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.users.length > 0 && props.users.map(user => (
                <UserRow key={user._id} user={user} onEdit={handleOnEdit} onDelete={handleOnDelete}/>
            ))}
            </tbody>
        </Table>
    )
}