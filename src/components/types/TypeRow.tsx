import {useContext, useEffect, useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/all";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {Role} from "../../domain/User";
import {ApplicationContext} from "../../context/ApplicationContext";

export const TypeRow = (props) => {
    const appCtx = useContext(ApplicationContext);
    const type = props.type;
    const [image, setImage] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = () => {
        setShowConfirmation(true);
    }

    const handleClose = () => {
        setShowConfirmation(false);
    }

    const handleConfirm = () => {
        setShowConfirmation(false);
        props.onDelete(type);
    }

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name));
    }

    useEffect(() => {
        imageHelper.getImage(loadImage, props.type.image);
    },[props]);

    return (
        <tr key={type._id} style={{ verticalAlign: "middle" }}>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", type._id)}>{type.description}</span></td>
            <td align="center">
                <Image src={image}
                        fluid width="60" title={type.image}/>
            </td>
            {appCtx.userData.role !== Role.GUEST &&
                <td align="center">
                    <BiEdit
                        onClick={() => props.onEdit("edit", type._id)}
                        title="Edit Type"
                        size="2em"
                        cursor="pointer"
                        color="blue"/>
                    <span> | </span>
                    <BiTrash
                        onClick={handleDelete}
                        title="Delete Type"
                        size="2em"
                        cursor="pointer"
                        color="red"/>
                </td>
            }
            <ConfirmModal show={showConfirmation} handleClose={handleClose} handleConfirm={handleConfirm}
                          title="Delete Type"  message={`Are you sure you want to delete the type '${type.description}'?`}/>
        </tr>
    );
}