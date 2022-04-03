import {Table} from "react-bootstrap";
import {useContext} from "react";
import {ApplicationContext} from "../../store/application-context";
import {typesApi} from "../../api/TypesAPI";
import {TypeRow} from "../types/TypeRow";

export const TypesList = (props) => {
    const appCtx = useContext(ApplicationContext);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleOnDelete = async (type) => {
        if (await typesApi.withToken(appCtx.userData.authToken).delete(type._id)) {
            props.onDelete(true, `Type '${type.name}' deleted successfully`);
        } else {
            props.onDelete(false);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th width="80%">Description</th>
                <th>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.types.length > 0 && props.types.map(type => (
                <TypeRow key={type._id} type={type} onEdit={handleOnEdit} onDelete={handleOnDelete}/>
            ))}
            </tbody>
        </Table>
    )
}