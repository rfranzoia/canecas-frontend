import { useCallback, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Role, User } from "../../domain/User";
import { Variation } from "../../domain/Variation";
import useVariationsApi from "../../hooks/useVariationsApi";
import { OpType, RootState } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { AlertToast } from "../ui/AlertToast";
import { CustomButton } from "../ui/CustomButton";
import { CustomPagination } from "../ui/CustomPagination";
import Modal from "../ui/Modal";
import { VariationEditForm } from "./VariationEditForm";
import { VariationsFilter } from "./VariationListFilter";
import { VariationsList } from "./VariationsList";

export const Variations = (props) => {
    const user = useSelector<RootState, User>((state) => state.auth.user);
    const [showVariationFormModal, setShowVariationFormModal] = useState(false);
    const [variationFormOp, setVariationFormOp] = useState(OpType.VIEW);
    const [variationId, setVariationId] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const dispatch = useDispatch();
    const { variations, list, create, update, remove, currentPage, totalPages } = useVariationsApi(props.isModal);

    const handleSaveVariation = async (variation: Variation) => {
        setShowVariationFormModal(false);
        setShowAlert(false);

        if (variationFormOp === OpType.NEW) {
            const error = await create(variation);
            if (error) {
                setShowAlert(true);
                error();
            }
        } else if (variationFormOp === OpType.EDIT) {
            const error = await update(variation);
            if (error) {
                setShowAlert(true);
                error();
            }
        }
    };

    const handleCloseNewVariationModal = () => {
        setShowVariationFormModal(false);
    };

    const handleFilterChange = useCallback(
        async (filter?: VariationsFilter) => {
            if (!filter) {
                await list(currentPage);
                return;
            }

            let g = "";
            if (filter.product) {
                g = g.concat(`product=${filter.product}`);
            }
            if (filter.drawings >= 0) {
                if (g.trim().length > 0) {
                    g = g.concat("&");
                }
                g = g.concat(`drawings=${filter.drawings}`);
            }
            if (filter.background) {
                if (g.trim().length > 0) {
                    g = g.concat("&");
                }
                g = g.concat(`background=${filter.background}`);
            }
            g = "?".concat(g);
            await list(1, g);
        },
        [list, currentPage]
    );

    const handleSelectVariation = (variation) => {
        props.onSelect(variation);
    };

    const handleNewVariation = () => {
        setVariationFormOp(OpType.NEW);
        setVariationId("");
        setShowVariationFormModal(true);
    };

    const handleEditVariation = (id: string) => {
        setVariationId(id);
        setVariationFormOp(OpType.EDIT);
        setShowVariationFormModal(true);
    };

    const handleConfirmDelete = async (id: string) => {
        const result = await remove(id);
        setShowAlert(true);
        result();
    };

    const handlePageChange = async (currPage) => {
        await list(currPage);
    };

    const handleFilterError = () => {
        dispatch(
            uiActions.handleAlert({
                show: true,
                type: AlertType.WARNING,
                title: "Filter Error",
                message: "You must select at least one filter type",
            })
        );
        setShowAlert(true);
    };

    useEffect(() => {
        list(1).then(undefined);
    }, [list]);

    return (
        <div>
            <AlertToast showAlert={showAlert}/>
            <Card border="dark">
                <Card.Header as="h3">Product Variations</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <div className="two-items-container">
                            {props.isModal !== "yes" && user.role === Role.ADMIN && (
                                <CustomButton
                                    caption="New Variation"
                                    type="new"
                                    customClass="fa-brands fa-hive"
                                    onClick={handleNewVariation}
                                />
                            )}
                            <CustomPagination
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                currPage={currentPage}
                            />
                        </div>
                    </Card.Title>
                    <VariationsList
                        variations={variations}
                        isModal={props.isModal}
                        onEdit={handleEditVariation}
                        onDelete={handleConfirmDelete}
                        onSelect={handleSelectVariation}
                        onFilterChange={handleFilterChange}
                        onFilterError={handleFilterError}
                    />
                </Card.Body>
            </Card>
            {props.isModal && (
                <>
                    <small>
                        Click on the &nbsp;
                        <span>
                            <i className={"fa fa-square-plus"} style={{ color: "black", fontSize: "1rem" }}/>
                        </span>
                        &nbsp; to select a product variation
                    </small>
                    <div className="actions">
                        <CustomButton caption="Cancel" onClick={props.onClose} type="close"/>
                    </div>
                </>
            )}
            {showVariationFormModal && (
                <Modal onClose={handleCloseNewVariationModal}>
                    <VariationEditForm
                        onSave={handleSaveVariation}
                        onCancel={handleCloseNewVariationModal}
                        variationId={variationId}
                        op={variationFormOp}
                    />
                </Modal>
            )}
        </div>
    );
};
