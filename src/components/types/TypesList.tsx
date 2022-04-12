import {Table} from "react-bootstrap";
import {useContext} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {typesApi} from "../../api/TypesAPI";
import {TypeRow} from "./TypeRow";

export const TypesList = (props) => {
    const appCtx = useContext(ApplicationContext);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleOnDelete = async (type) => {
        const result = await typesApi.withToken(appCtx.userData.authToken).delete(type._id);
        if (!result) {
            props.onDelete(true, type);
        } else {
            props.onDelete(false, result);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th style={{ width: "60%" }}>Nome</th>
                <th style={{ width: "10%", textAlign: "center" }}>Imagem</th>
                <th style={{ width: "10%" }}>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.types.length > 0 && props.types.map(type => (
                <TypeRow key={type._id}
                         type={type}
                         onEdit={handleOnEdit}
                         onDelete={handleOnDelete}/>
            ))}
            </tbody>
        </Table>
    )
}