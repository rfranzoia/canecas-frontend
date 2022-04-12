import {useContext, useEffect, useState} from "react";
import {productsApi} from "../../../api/ProductsAPI";
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import {AutoCompleteInput} from "../../ui/AutoCompleteInput";
import {CustomButton} from "../../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../../context/ApplicationContext";
import {AlertToast} from "../../ui/AlertToast";

export const NewOrderItemForm = (props) => {
    const appCtx = useContext(ApplicationContext);
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
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", "O produto, preço e quantidade devem ser informados!");
            return false;
        }
        if (isNaN(price) || isNaN(amount)) {
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", "Preço e Quantidade devem ser números!");
            return false;
        }
        if (price <= 0 || amount <= 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Erro de Validação", "Preço e Quantidade devem ter valores maiores que zero!");
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
            <AlertToast />
            <Card border="dark" className="align-content-center" style={{width: '29.2rem'}}>
                <Card.Body>
                    <Container>
                        <Form onSubmit={handleAdd}>
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <Form.Label>Produto<span aria-hidden="true"
                                                                 className="required">*</span></Form.Label>
                                        <AutoCompleteInput
                                            data={products}
                                            displayField="name"
                                            value={formData.product}
                                            onFieldSelected={handleSelectProduct}
                                            className="form-control bigger-input"
                                            required
                                            placeholder="Por favor selecione um produto"/>
                                        <small>Para exibir os produtos comece digitando o nome do produto</small>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="spaced-form-group">
                                        <Form.Label>Preço<span aria-hidden="true" className="required">*</span></Form.Label>
                                        <input
                                            className="form-control bigger-input"
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
                                    <Form.Group className="spaced-form-group">
                                        <Form.Label>Quantidade<span aria-hidden="true"
                                                                className="required">*</span></Form.Label>
                                        <input
                                            className="form-control bigger-input"
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
                                <CustomButton caption="Incluir" onClick={handleAdd} type="add" size="small"/>
                                &nbsp;
                                <CustomButton caption="Cancelar" onClick={handleCancel} type="close" size="small"/>
                                <p aria-hidden="true" id="required-description">
                                    <span aria-hidden="true" className="required">*</span>Campo(s) obrigatório(s)
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </>
    );
}