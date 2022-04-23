import {useContext, useEffect, useState} from "react";
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

export const Variations = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [showVariationFormModal, setShowVariationFormModal] = useState(false);
    const [variationFormOp, setVariationFormOp] = useState(OpType.VIEW);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [variations, setVariations] = useState([]);
    const [variationId, setVariationId] = useState(null);

    const loadVariations = (currPage) => {
        variationsApi.list(currPage)
            .then(result => {
                if (result.statusCode) {
                    const error = result?.response?.data;
                    appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
                } else {
                    setVariations(result);
                    setCurrentPage(currPage);
                }
            })
    }

    const getTotalPages = () => {
        variationsApi.count()
            .then(result => {
                setTotalPages(Math.ceil(result.count / DEFAULT_PAGE_SIZE));
            });
    }

    const handleSaveVariation = (variation: Variation) => {
        setShowVariationFormModal(false);

        if (variationFormOp === OpType.NEW) {
            variationsApi.withToken(appCtx.userData.authToken)
                .create(variation)
                .then(result => {
                    if (!result._id) {
                        console.error(result.name, result.description)
                        appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                        setShowAlert(true);
                    } else {
                        loadVariations(1);
                    }
                });
        } else if (variationFormOp === OpType.EDIT) {
            variationsApi.withToken(appCtx.userData.authToken)
                .update(variation._id, variation)
                .then(result => {
                    if (result.statusCode) {
                        console.error(result.name, result.description)
                        appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                        setShowAlert(true);
                    } else {
                        loadVariations(currentPage);
                    }
                });
        }

    }

    const handleCloseNewVariationModal = () => {
        setShowVariationFormModal(false);
    }

    const handleFilterApply = (filter?) => {
        if (filter) {
            let arr: string[] = [];

            if (filter.product) {
                arr.push(`product=${filter.product}`)
            }
            if (filter.drawings >= 0) {
                arr.push(`drawings=${filter.drawings}`)
            }
            if (filter.background) {
                arr.push(`background=${filter.background}`)
            }
            if (arr.length > 0) {
                let f = "";
                arr.forEach(a => {
                    if (f.trim().length > 0) {
                        f = f.concat("&");
                    }
                    f = f.concat(a);
                })
                f = "/filterBy?".concat(f);
                variationsApi.listBy(f)
                    .then(result => {
                        setVariations(result);
                    })
                return
            }
        }
        loadVariations(1);
    }

    useEffect(() => {
        loadVariations(1);
        getTotalPages();
    }, []);

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
                if (result) {
                    console.error(result.name, result.description)
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                    setShowAlert(true);
                } else {
                    appCtx.handleAlert(true, AlertType.SUCCESS, "Delete Variation", "Variation deleted successfully");
                    setShowAlert(true);
                    loadVariations(currentPage);
                }
            });
    }

    const handlePageChange = (currPage) => {
        loadVariations(currPage);
    }

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
        loadVariations(currentPage);
    }, [appCtx.alert.show]);

    useEffect(() => {
        if (!showVariationFormModal) {
            loadVariations(currentPage)
        }
    }, [showVariationFormModal])

    return (
        <div className="default-margin">
            {showAlert && <AlertToast />}
            <Card border="dark">
                <Card.Header as="h3">Product Variations</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <div className="two-items-container">
                            {props.isModal !== "yes" &&
                                <CustomButton caption="New Variation" type="new" customClass="fa-brands fa-hive"
                                              onClick={handleNewVariation}/>
                            }
                            <CustomPagination totalPages={totalPages} onPageChange={handlePageChange}/>
                        </div>
                    </Card.Title>
                    <VariationsList variations={variations}
                                    onEdit={handleEditVariation}
                                    onDelete={handleConfirmDelete}
                                    onSelect={handleSelectVariation}
                                    onFilterChange={handleFilterApply}
                    />
                </Card.Body>
            </Card>
            { showVariationFormModal &&
                <Modal onClose={handleCloseNewVariationModal} size="sm">
                    <VariationEditForm onSave={handleSaveVariation}
                                       onCancel={handleCloseNewVariationModal}
                                       variationId={variationId}
                                       op={variationFormOp} />
                </Modal>
            }
        </div>
    );
}