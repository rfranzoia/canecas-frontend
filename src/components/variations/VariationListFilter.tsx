import {Col, Container, Form, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {CustomButton} from "../ui/CustomButton";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {productsApi} from "../../api/ProductsAPI";

export const VariationListFilter = (props) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        filterCheck: false,
        filterByProductCheck: false,
        filterByDrawingsCheck: false,
        filterByBackgroundCheck: false,
        product: "",
        drawings: 0,
        background: "empty"
    });

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
        let filter = {};
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
        if (!formData.filterCheck) {
            props.onFilterApply()
        } else {
            props.onFilterApply(createFilter());
        }
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
        props.onFilterApply();
    }

    useEffect(() => {
        productsApi.list()
            .then(result => {
                setProducts(result);
            });
    }, [])

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
            props.onFilterApply();
        }
    },[formData.filterCheck])

    return (
        <div className="form-small-font">
            <form>
                <Container style={{padding: "0.5rem"}} fluid>
                    <Row style={{margin: "0.5rem"}}>
                        <Col>
                            <Form.Check type="checkbox"
                                        label="Filter List By"
                                        id="checkFilterList"
                                        name="filterCheck"
                                        checked={formData.filterCheck}
                                        onChange={handleChange}/>
                        </Col>
                    </Row>
                    <Row style={{margin: "0.5rem"}}>
                        <Col>
                            {formData.filterCheck &&
                                <Container>
                                    <Row className="mb-3">
                                        <Col md={2}>
                                            <Form.Group className="spaced-form-group">
                                                <Form.Check type="checkbox"
                                                            label="Product"
                                                            id="checkProduct"
                                                            name="filterByProductCheck"
                                                            checked={formData.filterByProductCheck}
                                                            onChange={handleChange}/>

                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <AutoCompleteInput
                                                className="bigger-input"
                                                style={{width: "25rem"}}
                                                data={products}
                                                displayFields="name"
                                                value={formData.product}
                                                onFieldSelected={handleSelectProduct}
                                                disabled={!formData.filterByProductCheck}
                                                placeholder="Please select a product"/>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={2}>
                                            <Form.Group className="spaced-form-group">
                                                <Form.Check type="checkbox"
                                                            label="Drawings"
                                                            id="checkDrawings"
                                                            name="filterByDrawingsCheck"
                                                            checked={formData.filterByDrawingsCheck}
                                                            onChange={handleChange}/>


                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Select value={formData.drawings}
                                                         onChange={handleChange}
                                                         disabled={!formData.filterByDrawingsCheck}
                                                         name="drawings">
                                                <option value={0}>0</option>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={9}>+ de 3</option>
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={2}>
                                            <Form.Group className="spaced-form-group">
                                                <Form.Check type="checkbox"
                                                            label="Background"
                                                            id="checkBackground"
                                                            name="filterByBackgroundCheck"
                                                            checked={formData.filterByBackgroundCheck}
                                                            onChange={handleChange}/>


                                            </Form.Group>
                                        </Col>
                                        <Col>
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
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <CustomButton
                                                caption="Apply Filter"
                                                type="custom-primary"
                                                customClass="fa fa-list-check"
                                                onClick={handleApplyFilter}/>
                                            &nbsp;
                                            <CustomButton
                                                caption="Clear Selection"
                                                type="close"
                                                onClick={handleClearFilter}/>
                                        </Col>
                                    </Row>
                                </Container>
                            }
                        </Col>
                    </Row>
                </Container>
            </form>
        </div>
    );
}