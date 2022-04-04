import {useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/all";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

export const ProductRow = (props) => {
    const product = props.product;
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = () => {
        setShowConfirmation(true);
    }

    const handleClose = () => {
        setShowConfirmation(false);
    }

    const handleConfirm = () => {
        setShowConfirmation(false);
        props.onDelete(product);
    }

    return (
        <tr key={product._id} valign="middle">
            <td>{product.name}</td>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", product._id)}>{product.description}</span></td>
            <td align="right">{product.price.toFixed(2)}</td>
            <td>{product.type}</td>
            <td align="center">
                <Image src={imageHelper.getImageUrl(product.image)}
                       fluid width="60" title={product.image}/>
            </td>
            <td align="center">
                <BiEdit
                    onClick={() => props.onEdit("edit", product._id)}
                    title="Edit Product"
                    size="2em"
                    cursor="pointer"
                    color="blue"/>
                <span> | </span>
                <BiTrash
                    onClick={handleDelete}
                    title="Delete Product"
                    size="2em"
                    cursor="pointer"
                    color="red"/>
            </td>
            <ConfirmModal show={showConfirmation} handleClose={handleClose} handleConfirm={handleConfirm}
                title="Delete Product"  message={`Are you sure you want to delete the product '${product.name}'?`}/>
        </tr>
    );
}