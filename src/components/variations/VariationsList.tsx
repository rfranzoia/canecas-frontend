import {VariationListFilter} from "./VariationListFilter";
import {VariationRow} from "./VariationRow";
import {Table} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {variationsApi} from "../../api/VariationAPI";
import {CustomButton} from "../ui/CustomButton";
import {VariationEditForm} from "./VariationEditForm";
import {Variation} from "../../domain/Variation";
import {AlertType, ApplicationContext, OpType} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import Modal from "../ui/Modal";

export const VariationsList = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const [variations, setVariations] = useState([]);
    const [showVariationFormModal, setShowVariationFormModal] = useState(false);
    const [variationFormOp, setVariationFormOp] = useState(OpType.VIEW);

    const loadVariations = () => {
        variationsApi.list()
            .then(result => {
                if (result.statusCode) {
                    const error = result?.response?.data;
                    appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
                } else {
                    setVariations(result);
                }
            })
    }

    const handleAddVariation = (variation: Variation) => {
        setShowVariationFormModal(false);

        variationsApi.withToken(appCtx.userData.authToken)
            .create(variation)
            .then(result => {
                if (!result._id) {
                    console.error(result.name, result.description)
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, JSON.stringify(result.description));
                    setShowAlert(true);
                } else {
                    loadVariations();
                }
            });

    }

    const handleCloseNewVariantModal = () => {
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
        loadVariations();
    }

    useEffect(() => {
        loadVariations();
    }, []);

    const handleNewVariation = () => {
        setVariationFormOp(OpType.NEW);
        setShowVariationFormModal(true);
    }

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
        loadVariations();
    }, [appCtx.alert.show]);

    return (
        <>
            {showAlert && <AlertToast />}
            <VariationListFilter onFilterApply={handleFilterApply}/>
            <CustomButton caption="New Variation" type="new" customClass="fa-brands fa-hive"
                          onClick={handleNewVariation}/>
            <br/>
            <div>
                <Table bordered striped hover className="table-small-font table-sm">
                    <thead>
                    <tr>
                        <th style={{width: "40%"}} colSpan={2}>Product</th>
                        <th style={{width: "25%", textAlign: "center"}}>Drawings</th>
                        <th style={{width: "25%", textAlign: "center"}}>Background</th>
                        <th style={{width: "10%", textAlign: "right"}}>Price</th>
                        <th style={{width: "10%", textAlign: "right"}}>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {variations.length > 0 && variations.map(v => {
                        return (
                            <VariationRow key={v._id} variation={v}/>
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
                { showVariationFormModal &&
                    <Modal onClose={handleCloseNewVariantModal} size="md">
                        <VariationEditForm onAdd={handleAddVariation}
                                           onCancel={handleCloseNewVariantModal}
                                           op={variationFormOp} />
                    </Modal>
                }
            </div>
        </>
    );
}