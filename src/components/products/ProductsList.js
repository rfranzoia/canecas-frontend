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
                <th width="20%">Name</th>
                <th width="35%">Description</th>
                <th width="6%">Price</th>
                <th width="15%">Type</th>
                <th width="10%">Image</th>
                <th width="6%">&nbsp;</th>
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