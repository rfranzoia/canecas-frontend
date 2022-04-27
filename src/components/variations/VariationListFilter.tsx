import {Col, Container, Form, Row} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import {CustomButton} from "../ui/CustomButton";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";

import styles from "./variationListFilter.module.css"
import useProducts from "../../hooks/useProducts";

export interface VariationsFilter {
    product?: string,
    drawings?: number,
    background?: string,
}

export const VariationListFilter = (props) => {
    const {products} = useProducts();
    const [formData, setFormData] = useState({
        filterCheck: false,
        filterByProductCheck: false,
        filterByDrawingsCheck: false,
        filterByBackgroundCheck: false,
        product: "",
        drawings: 0,
        background: "empty"
    });

    const {onFilterChange} = props;
    const handleFilterChange = useCallback((filter?: VariationsFilter) => {
        onFilterChange(filter);
    }, [onFilterChange])

    const handleChange = (event) => {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    const createFilter = () => {
        let filter: VariationsFilter = {};
        if (formData.filterByProductCheck) {
            filter = {
                product: formData.product
            }
        }
        if (formData.filterByDrawingsCheck) {
            filter = {
                ...filter,
                drawings: Number(formData.drawings)
            }
        }
        if (formData.filterByBackgroundCheck) {
            filter = {
                ...filter,
                background: formData.background
            }
        }
        return filter;
    }

    const handleApplyFilter = () => {
        if (!formData.filterByProductCheck && !formData.filterByDrawingsCheck && !formData.filterByBackgroundCheck) {
            props.onFilterError();
            return
        }
        onFilterChange(createFilter());
    }

    const handleSelectProduct = (product) => {
        setFormData(prevState => {
            return {
                ...prevState,
                product: product
            }
        })
    }

    const handleClearFilter = () => {
        if (!formData.filterCheck) return;
        setFormData(prevState => {
            return {
                ...prevState,
                filterByProductCheck: false,
                filterByDrawingsCheck: false,
                filterByBackgroundCheck: false,
                product: "",
                drawings: 0,
                background: "empty"
            }
        })
        handleFilterChange();
    }

    useEffect(() => {
        if (!formData.filterCheck) {
            setFormData(prevState => {
                return {
                    ...prevState,
                    filterByProductCheck: false,
                    filterByDrawingsCheck: false,
                    filterByBackgroundCheck: false,
                    product: "",
                    drawings: 0,
                    background: "empty"
                }
            })
            handleFilterChange();
        }
    }, [formData.filterCheck, handleFilterChange])

    const disableClear = !formData.filterByProductCheck && !formData.filterByDrawingsCheck && !formData.filterByBackgroundCheck;

    return (
        <Container fluid className={styles["list-filter"]}>
            <form>
                <Row>
                    <Col>
                        <Form.Check type="checkbox"
                                    label="Filter Variations By"
                                    id="checkFilterList"
                                    name="filterCheck"
                                    checked={formData.filterCheck}
                                    onChange={handleChange}
                        />
                    </Col>
                </Row>
                {formData.filterCheck &&
                    <Row>
                        <Col>
                            <Row className="spaced-form-group">
                                <Col>
                                    <Form.Group>
                                        <div className={styles["inline-filter"]}>
                                            <Form.Check type="checkbox"
                                                        label="Product"
                                                        id="checkProduct"
                                                        name="filterByProductCheck"
                                                        checked={formData.filterByProductCheck}
                                                        onChange={handleChange}/>
                                            <AutoCompleteInput
                                                className={styles["bigger-input longer-input"]}
                                                style={{width: "25rem"}}
                                                data={products}
                                                displayFields="name"
                                                value={formData.product}
                                                onFieldSelected={handleSelectProduct}
                                                disabled={!formData.filterByProductCheck}
                                                placeholder="Please select a product"
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="spaced-form-group">
                                <Col>
                                    <Form.Group>
                                        <div className={styles["inline-filter"]}>
                                            <Form.Check type="checkbox"
                                                        label="Drawings"
                                                        id="checkDrawings"
                                                        name="filterByDrawingsCheck"
                                                        checked={formData.filterByDrawingsCheck}
                                                        onChange={handleChange}/>


                                            <Form.Select value={formData.drawings}
                                                         onChange={handleChange}
                                                         className={styles["custom-select"]}
                                                         disabled={!formData.filterByDrawingsCheck}
                                                         name="drawings">
                                                <option value={0}>0</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={9}>+ de 3</option>
                                            </Form.Select>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="spaced-form-group">
                                <Col>
                                    <Form.Group>
                                        <div className={styles["inline-filter"]}>
                                            <Form.Check type="checkbox"
                                                        label="Background"
                                                        id="checkBackground"
                                                        name="filterByBackgroundCheck"
                                                        checked={formData.filterByBackgroundCheck}
                                                        onChange={handleChange}/>

                                            <Form.Check type="radio"
                                                        label="Empty"
                                                        id="bgEmpty"
                                                        name="background"
                                                        value="empty"
                                                        checked={formData.background === "empty"}
                                                        disabled={!formData.filterByBackgroundCheck}
                                                        onChange={handleChange}/>
                                            <Form.Check type="radio"
                                                        label="Personalized"
                                                        id="bgPersonalized"
                                                        name="background"
                                                        value="personalized"
                                                        checked={formData.background === "personalized"}
                                                        disabled={!formData.filterByBackgroundCheck}
                                                        onChange={handleChange}/>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className={"actions"}>
                                        <CustomButton
                                            caption="Apply Filter"
                                            type="custom-primary"
                                            customClass="fa fa-list-check"
                                            disabled={disableClear}
                                            onClick={handleApplyFilter}/>
                                        <CustomButton
                                            caption="Clear Selection"
                                            type="close"
                                            disabled={disableClear}
                                            onClick={handleClearFilter}/>
                                    </div>

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                }
            </form>
        </Container>
    );
}