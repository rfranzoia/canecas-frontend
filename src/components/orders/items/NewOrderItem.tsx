import {useEffect, useState} from "react";
import {productsApi} from "../../../api/ProductsAPI";
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {CustomButton} from "../../ui/CustomButton";

export const NewOrderItem = (props) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product: "",
        price: 0,
        amount: 0
    });

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
        const selectedProduct = products.find(product => product.name === formData.product);
        const item = {
            product: formData.product,
            price: Number(formData.price),
            amount: Number(formData.amount),
            _id: selectedProduct._id
        }
        props.onItemAdd(item);
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

    return (
        <Card border="dark" className="align-content-center" style={{width: '29.2rem'}}>
            <Card.Body>
                <Container>
                    <Form onSubmit={handleAdd}>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Product</Form.Label>
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
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        style={{ textAlign: "right"}}
                                        value={Number(formData.price).toFixed(2)}
                                        onChange={handleChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        style={{ textAlign: "right"}}
                                        value={formData.amount}
                                        onChange={handleChange}/>
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
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}