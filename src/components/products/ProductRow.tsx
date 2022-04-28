import {useContext, useEffect, useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/bi";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {Role} from "../../domain/User";
import {ApplicationContext} from "../../context/ApplicationContext";

export const ProductRow = (props) => {
    const appCtx = useContext(ApplicationContext);
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

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name, "product"));
    }

    useEffect(() => {
        imageHelper.getImage(loadImage, props.product.image);
    },[props]);

    return (
        <tr key={product._id} style={{ verticalAlign: "middle" }}>
            <td>{product.name}</td>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", product._id)}>{product.description}</span></td>
            <td align="right">{product.price.toFixed(2)}</td>
            <td align="center">
                <Image src={image}
                       fluid width="60" title={product.name}/>
            </td>
            {appCtx.userData.role !== Role.GUEST &&
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
                        color="red"
                    />
                </td>
            }
            <ConfirmModal show={showConfirmation} handleClose={handleNotConfirmDelete} handleConfirm={handleConfirmDelete}
                title="Delete Product"  message={`Are you sure you want to delete the product '${product.name}'?`}/>
        </tr>
    );
}