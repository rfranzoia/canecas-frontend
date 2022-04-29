import {memo, useCallback, useEffect, useState} from "react";
import {OrderStatus, orderStatusAsArray} from "../../domain/Order";
import {Col, Container, Form, Row} from "react-bootstrap";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import useUsers from "../../hooks/useUsers";
import styles from "./ordersFilter.module.css";

export interface OrdersFilter {
    startDate?: string,
    endDate?: string,
    orderStatus?: OrderStatus,
    userEmail?: string,
}

const OrdersListFilter = (props) => {
    const {users} = useUsers();
    const [formData, setFormData] = useState({
        filterCheck: false,
        filterByDateCheck: false,
        filterByStatusCheck: false,
        filterByCustomerCheck: false,
        startDate: "",
        endDate: "",
        orderStatus: 0,
        userEmail: "",
    });

    const {onFilterChange} = props;
    const handleFilterChange = useCallback((filter?: OrdersFilter) => {
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

    const createFilter = (): OrdersFilter => {
        let filter: OrdersFilter = {};
        if (formData.filterByDateCheck) {
            filter = {
                startDate: formData.startDate.split("T")[0],
                endDate: formData.endDate.split("T")[0],
            }
        }
        if (formData.filterByStatusCheck) {
            filter = {
                ...filter,
                orderStatus: formData.orderStatus,
            }
        }
        if (formData.filterByCustomerCheck) {
            filter = {
                ...filter,
                userEmail: formData.userEmail,
            }
        }
        return filter;
    }

    const handleFilterApply = () => {
        if (!formData.filterByDateCheck && !formData.filterByStatusCheck && !formData.filterByCustomerCheck) {
            props.onFilterError("You must select at least one filter");
            return
        }
        handleFilterChange(createFilter())
    }

    const handleClearFilter = () => {
        if (!formData.filterCheck) return;
        setFormData(prevState => {
            return {
                ...prevState,
                filterByDateCheck: false,
                filterByStatusCheck: false,
                filterByCustomerCheck: false,
                startDate: "",
                endDate: "",
                orderStatus: 0,
                userEmail: "",
            }
        })
        handleFilterChange();
    }

    const handleSelectUser = (user) => {
        setFormData(prevState => {
            return {
                ...prevState,
                userEmail: user
            }
        })
    }

    useEffect(() => {
        if (!formData.filterCheck) {
            setFormData(prevState => {
                return {
                    ...prevState,
                    filterByDateCheck: false,
                    filterByStatusCheck: false,
                    filterByCustomerCheck: false,
                    startDate: "",
                    endDate: "",
                    orderStatus: 0,
                    userEmail: "",
                }
            })
            handleFilterChange();
        }
    }, [formData.filterCheck, handleFilterChange])

    const disableClear = !formData.filterByDateCheck && !formData.filterByStatusCheck && !formData.filterByCustomerCheck;

    return (
        <Container fluid className={styles["list-filter"]}>
            <Form>
                <Row>
                    <Col>
                        <Form.Check type="checkbox"
                                    label="Filter Orders By"
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
                                                        label="Date"
                                                        id="checkDate"
                                                        name="filterByDateCheck"
                                                        checked={formData.filterByDateCheck}
                                                        onChange={handleChange}/>
                                            <p>From:</p>
                                            <input className={styles["custom-date"]}
                                                   id="startDate"
                                                   name="startDate"
                                                   type="date"
                                                   value={formData.startDate}
                                                   onChange={handleChange}
                                                   disabled={!formData.filterByDateCheck}
                                            />
                                            <p>To:</p>
                                            <input className={styles["custom-date"]}
                                                   id="endDate"
                                                   name="endDate"
                                                   type="date"
                                                   value={formData.endDate}
                                                   onChange={handleChange}
                                                   disabled={!formData.filterByDateCheck}
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
                                                        label="Status"
                                                        id="checkStatus"
                                                        name="filterByStatusCheck"
                                                        checked={formData.filterByStatusCheck}
                                                        onChange={handleChange}/>
                                            <select id="orderStatus" name="orderStatus" required
                                                    value={formData.orderStatus}
                                                    onChange={handleChange}
                                                    className={styles["custom-select"]}
                                                    disabled={!formData.filterByStatusCheck}>
                                                <option value="">Please Select</option>
                                                {orderStatusAsArray().map((status, idx) => {
                                                    return (<option key={idx}
                                                                    value={status}>{OrderStatus[status]}</option>);
                                                })}
                                            </select>
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="spaced-form-group">
                                <Col>
                                    <Form.Group>
                                        <div className={styles["inline-filter"]}>
                                            <Form.Check type="checkbox"
                                                        label="Customer"
                                                        id="checkCustomer"
                                                        name="filterByCustomerCheck"
                                                        checked={formData.filterByCustomerCheck}
                                                        onChange={handleChange}/>
                                            <AutoCompleteInput
                                                data={users}
                                                value={formData.userEmail}
                                                displayFields="email,name"
                                                onFieldSelected={handleSelectUser}
                                                className={styles["custom-autocomplete"]}
                                                disabled={!formData.filterByCustomerCheck}
                                                placeholder="Please select an user email"/>
                                        </div>

                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="spaced-form-group">
                                <Col>
                                    <div className={"actions"}>
                                        <CustomButton
                                            caption="Apply Filter"
                                            type="custom-primary"
                                            customClass="fa fa-list-check"
                                            disabled={disableClear}
                                            onClick={handleFilterApply}/>
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
            </Form>
        </Container>
    );
}

export default memo(OrdersListFilter)