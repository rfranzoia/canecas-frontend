import {useEffect, useRef, useState} from "react";
import {productsApi} from "../../../api/ProductsAPI";
import {Button, Card, Col, Container, Form, Row} from "react-bootstrap";

export const NewOrderItem = (props) => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product: {},
        price: 0,
        amount: 0
    });

    const productRef = useRef();
    const priceRef = useRef();
    const amountRef = useRef();

    useEffect(() => {
        const load = async () => {
            const res = await productsApi.list();
            if (res) {
                setProducts(res);
            } else {
                setProducts([]);
            }
        }

        load().then(() => undefined);

    }, []);

    const handleAdd = (event) => {
        const selectedProduct = products.find(product => product.name === productRef.current.value);
        const item = {
            product: productRef.current.value,
            price: Number(priceRef.current.value),
            amount: Number(amountRef.current.value),
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

    return (
        <Card border="dark" className="align-content-center" style={{width: '29.2rem'}}>
            <Card.Body>
                <Container>
                    <Form onSubmit={handleAdd}>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Product</Form.Label>
                                    <Form.Select aria-label="products"
                                                 name="product"
                                                 ref={productRef}

                                                 value={formData.product}
                                                 onChange={handleChange}>
                                        <option>-- Select a Product --</option>
                                        {products.map(product => {
                                            return (
                                                <option key={product._id} value={product.name}>{product.name}</option>
                                            )
                                        })}
                                    </Form.Select>
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
                                        ref={priceRef}
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
                                        ref={amountRef}
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
                            <Button variant="primary" onClick={handleAdd} size="sm">Add</Button>
                            &nbsp;
                            <Button variant="danger" onClick={handleCancel} size="sm">Cancel</Button>
                        </Col>
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    );
}