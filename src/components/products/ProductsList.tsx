import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {ProductRow} from "./ProductRow";
import {Role} from "../../domain/User";

export const ProductsList = (props) => {
    const appCtx = useContext(ApplicationContext);
    const {getToken} = appCtx;

    const handleEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleDelete = async (product) => {
        if (!getToken()) return;
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
                {appCtx.userData.role === Role.ADMIN &&
                    <th style={{width: "8%"}}>&nbsp;</th>
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
