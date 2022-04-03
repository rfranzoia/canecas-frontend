import {productsApi} from "../../api/ProductsAPI";
import {EditProductForm} from "./EditProductForm";
import {useContext, useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import {ApplicationContext} from "../../store/application-context";

export const EditProduct = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        type: ""
    });

    const handleSaveProduct = (product) => {
        const callback = async (product) => {
            if (props.op === "edit") {
                await productsApi.withToken(appCtx.userData.authToken).update(props.id, product)
            } else if (props.op === "new") {
                await productsApi.withToken(appCtx.userData.authToken).create(product);
            }
        }
        callback(product)
            .then(() => props.onSaveCancel());

    }

    const handleCancel = () => {
        props.onSaveCancel();
    }

    useEffect(() => {
        const callback = async () => {
            if (props.op === "edit" || props.op === "view") {
                const p = await productsApi.get(props.id);
                setProduct(p);
            } else {
                setProduct({
                    name: "",
                    description: "",
                    price: 0,
                    type: ""
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, props.op]);

    const title = props.op === "new" ? "New" :
                    props.op === "edit" ? "Edit" : "View";

    const handleOp = (product) => {
        if (props.op !== "view") {
            handleSaveProduct(product);
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col sm={2}></Col>
                <Col md="auto">
                    <Card border="dark" className="align-content-center" style={{ width: '46.5rem'}}>
                        <Card.Header as="h2">{`${title} Product`}</Card.Header>
                        <Card.Body>
                            <EditProductForm product={product} op={props.op} onSaveProduct={handleOp} onCancel={handleCancel}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm={2}></Col>
            </Row>
        </Container>

    );
}