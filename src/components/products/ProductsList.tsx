import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { ProductRow } from "./ProductRow";

export const ProductsList = (props) => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const loggedUser = useSelector<RootState, User>((state) => state.auth.user);

    const handleEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleDelete = async (product) => {
        if (!loggedUser.authToken) return;
        props.onDelete(product);
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "30%" }}>Description</th>
                <th style={{ width: "7%" }}>Price</th>
                <th style={{ width: "10%" }}>Image</th>
                {user.role === Role.ADMIN &&
                    <th style={{ width: "8%" }}>&nbsp;</th>
                }
            </tr>
            </thead>
            <tbody>
            {props.products.length > 0 && props.products.map(product => (
                <ProductRow key={product._id} product={product} onEdit={handleEdit} onDelete={handleDelete}/>
            ))}
            </tbody>
        </Table>
    )
}
