import {useContext} from "react";
import {Table} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {productsApi} from "../../api/ProductsAPI";
import {ProductRow} from "./ProductRow";

export const ProductsList = (props) => {
    const appCtx = useContext(ApplicationContext);

    const handleOnEdit = (op, id) => {
        props.onEdit(op, id);
    }

    const handleOnDelete = async (product) => {
        if (await productsApi.withToken(appCtx.userData.authToken).delete(product._id)) {
            props.onDelete(true, `Product '${product.name}' deleted successfully`);
        } else {
            props.onDelete(false);
        }
    }

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th style={{ width: "20%" }}>Name</th>
                <th style={{ width: "30%" }}>Description</th>
                <th style={{ width: "7%" }}>Price</th>
                <th style={{ width: "15%" }}>Type</th>
                <th style={{ width: "10%" }}>Image</th>
                <th style={{ width: "8%" }}>&nbsp;</th>
            </tr>
            </thead>
            <tbody>
            {props.products.length > 0 && props.products.map(product => (
                <ProductRow key={product._id} product={product} onEdit={handleOnEdit} onDelete={handleOnDelete}/>
            ))}
            </tbody>
        </Table>
    )
}