import {VariationListFilter} from "./VariationListFilter";
import {Table} from "react-bootstrap";
import {VariationRow} from "./VariationRow";
import {OpType} from "../../context/ApplicationContext";
import {ConfirmModal} from "../ui/ConfirmModal";
import {useEffect, useState} from "react";
import {Role, User} from "../../domain/User";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

export const VariationsList = (props) => {
    const user = useSelector<RootState, User>(state => state.auth.user);
    const [variations, setVariations] = useState([]);
    const [confirmationDialog, setConfirmationDialog] = useState({
            show: false,
            title: "",
            message: "",
            hasData: false,
            op: "",
            onConfirm: () => undefined,
            onCancel: () => undefined
        }
    );

    const handDeleteVariation = (id: string) => {
        setConfirmationDialog({
            show: true,
            title: "Delete Order",
            message: `Are you sure you want to delete the Variation '${id}'?`,
            op: "delete",
            hasData: false,
            onConfirm: () => handleConfirmDelete(id),
            onCancel: () => handleCloseConfirmDialog()
        });

    }

    const handleConfirmDelete = (id: string) => {
        handleCloseConfirmDialog();
        props.onDelete(id);
    }

    const handleCloseConfirmDialog = () => {
        setConfirmationDialog({
            show: false,
            title: "",
            message: "",
            hasData: false,
            op: "",
            onConfirm: () => undefined,
            onCancel: () => undefined
        });
    }

    const handleSelect = (variation) => {
        props.onSelect(variation);
    }

    useEffect(() => {
        setVariations(props.variations);
    }, [props.variations])

    return (
        <>
            <VariationListFilter onFilterChange={props.onFilterChange} onFilterError={props.onFilterError}/>
            <div>
                <Table bordered striped hover className="table-small-font table-sm">
                    <thead>
                    <tr>
                        <th style={{width: "35%"}} colSpan={2}>Product</th>
                        <th style={{width: "20%", textAlign: "center"}}>Drawings</th>
                        <th style={{width: "20%", textAlign: "center"}}>Background</th>
                        <th style={{width: "10%", textAlign: "right"}}>Price</th>
                        { user.role === Role.ADMIN &&
                            <th style={{width: "10%", textAlign: "right"}}>&nbsp;</th>
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {variations.length > 0 && variations.map(v => {
                        return (
                            <VariationRow key={v._id}
                                          variation={v}
                                          onEdit={props.onEdit}
                                          onDelete={handDeleteVariation}
                                          onSelect={handleSelect}
                                          op={props.isModal === "yes"? OpType.SELECT: "none"}
                            />
                        )
                    })}
                    {(!variations || variations.length === 0) &&
                        <tr>
                            <td colSpan={6}>
                                No variations were found
                            </td>
                        </tr>
                    }
                    </tbody>
                </Table>
                { confirmationDialog.show &&
                    <ConfirmModal
                        show={confirmationDialog.show}
                        handleClose={confirmationDialog.onCancel}
                        handleConfirm={confirmationDialog.onConfirm}
                        title={confirmationDialog.title}
                        message={confirmationDialog.message}/>
                }
            </div>
        </>
    );
}