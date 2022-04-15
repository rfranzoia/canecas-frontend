import {useEffect, useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/all";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

export const ProductRow = (props) => {
    const product = props.product;
    const [image, setImage] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = () => {
        setShowConfirmation(true);
    }

    const handleNotConfirmDelete = () => {
        setShowConfirmation(false);
    }

    const handleConfirmDelete = () => {
        setShowConfirmation(false);
        props.onDelete(product);
    }

    const getImage = (name) => {
        const load = async () => {
            setImage(await imageHelper.getImageFromServer(name));
        }

        load().then(() => null);
    }

    useEffect(() => {
        getImage(props.product.image);
    },[props]);

    return (
        <tr key={product._id} style={{ verticalAlign: "middle" }}>
            <td>{product.name}</td>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", product._id)}>{product.description}</span></td>
            <td align="right">{product.price.toFixed(2)}</td>
            <td>{product.type}</td>
            <td align="center">
                <Image src={image}
                       fluid width="60" title={product.name}/>
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
            <ConfirmModal show={showConfirmation} handleClose={handleNotConfirmDelete} handleConfirm={handleConfirmDelete}
                title="Delete Product"  message={`Are you sure you want to delete the product '${product.name}'?`}/>
        </tr>
    );
}