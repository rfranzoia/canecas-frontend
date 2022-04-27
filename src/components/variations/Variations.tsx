import {useCallback, useContext, useEffect, useState} from "react";
import {Card} from "react-bootstrap";
import {variationsApi} from "../../api/VariationAPI";
import {CustomButton} from "../ui/CustomButton";
import {AlertToast} from "../ui/AlertToast";
import {CustomPagination} from "../ui/CustomPagination";
import {Variation} from "../../domain/Variation";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {DEFAULT_PAGE_SIZE} from "../../api/axios";
import {VariationsList} from "./VariationsList";
import Modal from "../ui/Modal";
import {VariationEditForm} from "./VariationEditForm";
import {Role} from "../../domain/User";
import {VariationsFilter} from "./VariationListFilter";
import {StatusCodes} from "http-status-codes";

export const Variations = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [showVariationFormModal, setShowVariationFormModal] = useState(false);
    const [variationFormOp, setVariationFormOp] = useState(OpType.VIEW);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [variations, setVariations] = useState([]);
    const [variationId, setVariationId] = useState(null);
    const {handleAlert} = appCtx;

    const loadVariations = useCallback((currPage: number, filter?: string) => {
        const pageSize = props.isModal ? DEFAULT_PAGE_SIZE / 2 : DEFAULT_PAGE_SIZE;
        variationsApi.withPageSize(pageSize).listByFilter(currPage, filter)
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    const error = result?.response?.data;
                    handleAlert(true, AlertType.DANGER, error.name, error.description);
                } else {
                    setVariations(result.data);
                    setCurrentPage(currPage);
                }
            })
    }, [handleAlert, props.isModal])

    const getTotalPages = useCallback(() => {
        const pageSize = props.isModal ? DEFAULT_PAGE_SIZE / 2 : DEFAULT_PAGE_SIZE;
        variationsApi.withPageSize(pageSize).count()
            .then(result => {
                if (result.statusCode !== StatusCodes.OK) {
                    setTotalPages(0);
                } else {
                    setTotalPages(Math.ceil(result.data.count / pageSize));
                }
            });
    }, [props.isModal])

    const handleSaveVariation = (variation: Variation) => {
        setShowVariationFormModal(false);

        if (variationFormOp === OpType.NEW) {
            variationsApi.withToken(appCtx.userData.authToken)
                .create(variation)
                .then(result => {
                    if (result.statusCode !== StatusCodes.CREATED) {
                        console.error(result.name, result.description)
                        appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                        setShowAlert(true);
                    } else {
                        setShowAlert(false);
                        getTotalPages();
                        loadVariations(1);
                    }
                });
        } else if (variationFormOp === OpType.EDIT) {
            variationsApi.withToken(appCtx.userData.authToken)
                .update(variation._id, variation)
                .then(result => {
                    if (result.statusCode !== StatusCodes.OK) {
                        console.error(result.name, result.description)
                        appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                        setShowAlert(true);
                    } else {
                        setShowAlert(false);
                        loadVariations(currentPage);
                    }
                });
        }

    }

    const handleCloseNewVariationModal = () => {
        setShowVariationFormModal(false);
    }

    const handleFilterChange = useCallback((filter?: VariationsFilter) => {
        if (!filter) {
            loadVariations(currentPage);
            return;
        }

        let g = "";
        if (filter.product) {
            g = g.concat(`product=${filter.product}`)
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
        loadVariations(1, g);
    }, [currentPage, loadVariations])

    const handleSelectVariation = (variation) => {
        props.onSelect(variation);
    }

    const handleNewVariation = () => {
        setVariationFormOp(OpType.NEW);
        setVariationId("");
        setShowVariationFormModal(true);
    }

    const handleEditVariation = (id: string) => {
        setVariationId(id);
        setVariationFormOp(OpType.EDIT);
        setShowVariationFormModal(true);
    }

    const handleConfirmDelete = (id: string) => {
        variationsApi.withToken(appCtx.userData.authToken)
            .delete(id)
            .then(result => {
                if (result && result.statusCode !== StatusCodes.OK) {
                    console.error(result.name, result.description)
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                } else {
                    appCtx.handleAlert(true, AlertType.WARNING, "Delete Variation", "Variation deleted successfully");
                    getTotalPages();
                    loadVariations(1);
                }
                setShowAlert(true);
            });
    }

    const handlePageChange = (currPage) => {
        loadVariations(currPage);
    }

    const handleFilterError = () => {
        handleAlert(true, AlertType.WARNING, "Filter Error", "You must select at least one filter type");
        setShowAlert(true);
    }

    useEffect(() => {
        getTotalPages();
        loadVariations(1);
    }, [loadVariations, getTotalPages]);

    return (
        <div>
            {showAlert && <AlertToast/>}
            <Card border="dark">
                <Card.Header as="h3">Product Variations</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <div className="two-items-container">
                            {props.isModal !== "yes" && appCtx.userData.role === Role.ADMIN &&
                                <CustomButton caption="New Variation" type="new" customClass="fa-brands fa-hive"
                                              onClick={handleNewVariation}/>
                            }
                            <CustomPagination totalPages={totalPages} onPageChange={handlePageChange}
                                              currPage={currentPage}/>
                        </div>
                    </Card.Title>
                    <VariationsList variations={variations}
                                    isModal={props.isModal}
                                    onEdit={handleEditVariation}
                                    onDelete={handleConfirmDelete}
                                    onSelect={handleSelectVariation}
                                    onFilterChange={handleFilterChange}
                                    onFilterError={handleFilterError}
                    />
                </Card.Body>
            </Card>
            {props.isModal &&
                <>
                    <small>Click on the &nbsp;
                        <span>
                            <i className={"fa fa-square-plus"} style={{color: "black", fontSize: "1rem"}}/>
                        </span>&nbsp; to select a product variation
                    </small>
                    <div className="actions">
                        <CustomButton caption="Cancel" onClick={props.onClose} type="close"/>
                    </div>
                </>
            }
            {showVariationFormModal &&
                <Modal onClose={handleCloseNewVariationModal}>
                    <VariationEditForm onSave={handleSaveVariation}
                                       onCancel={handleCloseNewVariationModal}
                                       variationId={variationId}
                                       op={variationFormOp}/>
                </Modal>
            }
        </div>
    );
}