import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Role, User } from "../../domain/User";
import { RootState } from "../../store";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { ConfirmModal } from "../ui/ConfirmModal";
import { imageHelper } from "../ui/ImageHelper";

export const ProductRow = (props) => {
    const user = useSelector<RootState, User>(state => state.auth.user);
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
    }, [props]);

    return (
        <tr key={product._id} style={{verticalAlign: "middle"}}>
            <td>{product.name}</td>
            <td width={"50%"}><span style={{cursor: "pointer", color: "blue"}}
                                    onClick={() => props.onEdit("view", product._id)}>{product.description}</span></td>
            <td align="right">{product.price.toFixed(2)}</td>
            <td align="center">
                <Image src={image}
                       fluid width="60" title={product.name}/>
            </td>
            {user.role === Role.ADMIN &&
                <td align="center" width={"10%"}>
                    {
                        getActionIcon(ActionIconType.EDIT,
                            "Edit Product",
                            true,
                            () => props.onEdit("edit", product._id))
                    }
                    {
                        getActionIcon(ActionIconType.DELETE,
                            "Delete Product",
                            true,
                            () => handleDelete())
                    }
                </td>
            }
            <ConfirmModal show={showConfirmation} handleClose={handleNotConfirmDelete}
                          handleConfirm={handleConfirmDelete}
                          title="Delete Product"
                          message={`Are you sure you want to delete the product '${product.name}'?`}/>
        </tr>
    );
}