import {useEffect, useState} from "react";
import {productsApi} from "../../../api/ProductsAPI";
import {Alert, Card, Col, Container, Form, Row} from "react-bootstrap";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {CustomButton} from "../../ui/CustomButton";

export const NewOrderItem = (props) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product: "",
        price: 0,
        amount: 0
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
            }, 3000);
        }
    };

    useEffect(() => {
        const load = async () => {
            const res = await productsApi.list();
            if (res) {
                setProducts(
                    res.map(r => {
                        return {
                            ...r,
                            label: r.name
                        }
                    })
                );
            } else {
                setProducts([]);
            }
        }

        load().then(() => undefined);

    }, []);

    const handleAdd = () => {
        if (!isValidData()) return;
        const selectedProduct = products.find(product => product.name === formData.product);
        const item = {
            product: formData.product,
            price: isNaN(Number(formData.price)) ? 0 : Number(formData.price),
            amount: isNaN(Number(formData.amount)) ? 0 : Number(formData.amount),
            _id: selectedProduct._id
        }
        props.onItemAdd(item);
    }

    const isValidData = (): boolean => {
        const { product, price, amount } = formData;
        if (product.trim().length === 0 || price.toString().trim().length === 0 ||
            amount.toString().trim().length === 0) {
            handleAlert(true, "danger", "Validation Error!", "Product, price and amount must be provided!");
            return false;
        }
        if (isNaN(price) || isNaN(amount)) {
            handleAlert(true, "danger", "Validation Error!", "Price and Amount must be valid numbers!");
            return false;
        }
        if (price <= 0 || amount <= 0) {
            handleAlert(true, "danger", "Validation Error!", "Product, price and amount must be greater than zero!");
            return false;
        }
        return true;
    }
    const handleCancel = () => {
        props.onCancelItemAdd();
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    const handleSelectProduct = (product) => {
        setFormData(prevState => {
            return {
                ...prevState,
                product: product
            }
        })
    }

    const handleNumberInput = (e) => {
        let {name, value} = e.target;
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        if (isNaN(value)) {
            value = 0;
        }
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: Number(value).toFixed(2)
            }
        });
    }

    return (
        <>
            {alert.show && (
                <div>
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            )}
            <Card border="dark" className="align-content-center" style={{width: '29.2rem'}}>
                <Card.Body>
                    <Container>
                        <Form onSubmit={handleAdd}>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Product<span aria-hidden="true"
                                                                 className="required">*</span></Form.Label>
                                        <AutoCompleteInput
                                            data={products}
                                            displayField="name"
                                            value={formData.product}
                                            onFieldSelected={handleSelectProduct}
                                            className="form-control"
                                            required
                                            placeholder="Please select a product"/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Price<span aria-hidden="true" className="required">*</span></Form.Label>
                                        <input
                                            className="form-control"
                                            required
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            style={{textAlign: "right"}}
                                            onInput={handleNumberInput}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Amount<span aria-hidden="true"
                                                                className="required">*</span></Form.Label>
                                        <input
                                            className="form-control"
                                            required
                                            type="text"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            style={{textAlign: "right"}}
                                            onInput={handleNumberInput}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                        <br/>
                        <Row>
                            <Col>
                                <CustomButton caption="Add" onClick={handleAdd} type="add" size="small"/>
                                &nbsp;
                                <CustomButton caption="Cancel" onClick={handleCancel} type="close" size="small"/>
                                <p aria-hidden="true" id="required-description">
                                    <span aria-hidden="true" className="required">*</span>Required field(s)
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}