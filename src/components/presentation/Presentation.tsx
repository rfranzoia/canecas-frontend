import {CustomButton} from "../ui/CustomButton";
import {Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {QuoteRequestForm} from "./QuoteRequestForm";
import {ALERT_TIMEOUT, AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {imageHelper} from "../ui/ImageHelper";
import {productsApi} from "../../api/ProductsAPI";
import {StatusCodes} from "http-status-codes";
import {ProductShowCaseRow} from "./ProductShowCaseRow";
import {Product} from "../../domain/Product";

export const Presentation = () => {
    const appCtx = useContext(ApplicationContext);
    const [showFormCotacao, setShowFormCotacao] = useState(false);
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);

    const handleShowCotacao = () => {
        setShowFormCotacao(true);
    }

    const handleConfirm = (zapLink: string) => {
        appCtx.handleAlert(true, AlertType.SUCCESS, "Request Quote",
            "Parabéns! Seu pedido de cotação foi enviado. Em breve entraremos em contato para confirmar umas coisinhas.");
        setShowAlert(true);
        handleCancel();
        setTimeout(() => {
            window.location.href=zapLink
        }, ALERT_TIMEOUT);
    }

    const handleCancel = () => {
        setShowFormCotacao(false);
    }

    useEffect(() => {
        productsApi.listOrderByType()
            .then((result) => {
                if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                    setShowAlert(true);
                    setProducts([]);
                } else {
                    let mapped = [{
                        product: result[0],
                        type: result[0].type,
                        price: 999999
                    }]
                    let product: Product;
                    for (let i = 0; i < result.length; i++) {
                        product = result[i];
                        if (product.type !== mapped[mapped.length - 1].type) {
                            mapped.push({
                                product: product,
                                type: product.type,
                                price: 999999
                            })
                        }
                        if (product.price < mapped[mapped.length - 1].price) {
                            mapped[mapped.length - 1].price = product.price;
                        }
                    }
                    if (product.price < mapped[mapped.length - 1].price) {
                        mapped[mapped.length - 1].price = product.price;
                    }
                    setProducts(mapped);
                }
            });
    }, [appCtx])

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    }, [appCtx.alert.show])

    return (
        <div className="default-margin">
            {(appCtx.alert.show && showAlert) &&
                <AlertToast/>
            }
            <div style={{
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "30rem",
                position: "relative"
            }}>
                <h1>Caricanecas Manauara</h1>
                <p style={{textAlign: "center"}}>Caricanecas Manaus/AM<br/>
                    ✏️ Usamos a arte para encantar com um produto que é a sua cara!
                    Um brinde que é a sua cara!❤️<br/>
                    Gostou da ideia? Faça seu pedido com a gente!👇
                </p>
                <div>
                    <CustomButton caption="Solicitar Cotação" customClass="fa fa-money-check-dollar"
                                  onClick={handleShowCotacao} type="login"/>
                </div>
            </div>
            <br/>
            <div className="flex-centered-container">
                <Image src={imageHelper.getImageUrl("perfil-caricanecas.jpeg")}
                       fluid width="800" title="perfil caricanecas"/>
            </div>
            <Card border="dark" style={{ width: "90%", margin: "auto"}}>
                <Card.Header as="h3">Nossos Produtos</Card.Header>
                <Card.Body>
                    <div className="flex-card">
                        {products.map(p => {
                            return (
                                <ProductShowCaseRow key={p.product._id} product={p}/>
                            )
                        })}
                    </div>
                    <p style={{textAlign: "center"}}>Clique na imagem para saber mais</p>
                </Card.Body>
            </Card>
            <Modal
                show={showFormCotacao}
                onHide={handleCancel}
                backdrop="static"
                centered
                style={{justifyItems: "center", margin: "auto"}}
                keyboard={true}>
                <Modal.Body>
                    <Container fluid
                               style={{padding: "1rem", display: "flex", justifyContent: "center", width: "auto"}}>
                        <Row>
                            <Col md="auto">
                                <QuoteRequestForm onConfirm={handleConfirm} onCancel={handleCancel}/>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
        </div>
    );
}