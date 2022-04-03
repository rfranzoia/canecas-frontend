import {useState} from "react";
import {ConfirmModal} from "../ui/ConfirmModal";
import {BiEdit, BiTrash} from "react-icons/all";

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
        <tr key={type._id} valign="middle">
            <td><span style={{cursor: "pointer"}} onClick={() => props.onEdit("view", type._id)}>{type.description}</span></td>
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
            <ConfirmModal show={showConfirmation} handleClose={handleClose} handleConfirm={handleConfirm}
                          title="Delete Type"  message={`Are you sure you want to delete the type '${type.description}'?`}/>
        </tr>
    );
}