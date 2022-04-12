import {useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/all";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

export const TypeRow = (props) => {
    const type = props.type;
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

    return (
        <tr key={type._id} style={{ verticalAlign: "middle" }}>
            <td><span style={{cursor: "pointer", color: "blue"}} onClick={() => props.onEdit("view", type._id)}>{type.description}</span></td>
            <td align="center">
                <Image src={imageHelper.getImageUrl(type.image)}
                        fluid width="60" title={type.image}/>
            </td>
            <td align="center">
                <BiEdit
                    onClick={() => props.onEdit("edit", type._id)}
                    title="Editar Tipo"
                    size="2em"
                    cursor="pointer"
                    color="blue"/>
                <span> | </span>
                <BiTrash
                    onClick={handleDelete}
                    title="Remover Tipo"
                    size="2em"
                    cursor="pointer"
                    color="red"/>
            </td>
            <ConfirmModal show={showConfirmation}
                          handleClose={handleClose}
                          handleConfirm={handleConfirm}
                          title="Remover Tipo"
                          message={`Você tem certeza que deseja REMOVER o Tipo '${type.description}'?`}/>
        </tr>
    );
}