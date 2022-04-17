import {CustomButton} from "../ui/CustomButton";
import {Card, Col, Container, Image, Modal, Row} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {QuoteRequestForm} from "./QuoteRequestForm";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {imageHelper} from "../ui/ImageHelper";
import {productsApi} from "../../api/ProductsAPI";
import {StatusCodes} from "http-status-codes";
import {ProductShowCaseRow} from "./ProductShowCaseRow";
import {Product} from "../../domain/Product";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {HowToOrderPresentation} from "./HowToOrderPresentation";

export const Presentation = () => {
    const appCtx = useContext(ApplicationContext);
    const [showFormQuote, setShowFormQuote] = useState(false);
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showHowToOrder, setShowHowToOrder] = useState(false);

    const handleShowQuote = () => {
        setShowFormQuote(true);
    }

    const handleConfirm = () => {
        appCtx.handleAlert(true, AlertType.SUCCESS, "Request Quote",
            "Congratulations! Your quote has been sent. You'll be hearing from us soon");
        setShowAlert(true);
        handleCancel();
    }

    const handleCancel = () => {
        setShowFormQuote(false);
    }

    const handleWhatsappClick = () => {
        const link = "https://api.whatsapp.com/send/?phone=5592996317532&text=";
        const message = `Olá,\neu gostaria de mais informações sobre os produtos de vocês`

        window.location.href=link.concat(message);
    }

    const handleShowHowToOrder = (show: boolean) => {
        setShowHowToOrder(show);
    }

    useEffect(() => {
        productsApi.listOrderByType()
            .then((result) => {
                if (!result) return;
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

    useEffect(() => {
        appCtx.checkValidLogin()
            .then(() => undefined);
    }, [])



    return (
        <div className="default-margin">
            {(appCtx.alert.show && showAlert) &&
                <AlertToast/>
            }
            <div className="some-centered-container">
                <h1>Caricanecas Manauara</h1>
                <p style={{textAlign: "center"}}>Caricanecas Manaus/AM<br/>
                    ✏️ Usamos a arte para encantar com um produto que é a sua cara!
                    Um brinde que é a sua cara!❤️<br/>
                    Gostou da ideia? Faça seu pedido com a gente!👇
                </p>
                <div>
                    <CustomButton caption="Request Quote" customClass="fa fa-money-check-dollar"
                                  onClick={handleShowQuote} type="custom-success"/>
                </div>
                <p style={{textAlign: "center"}}>You can also send us a message on &nbsp;
                    <span style={{cursor: "pointer"}} onClick={handleWhatsappClick}>{getActionIcon(ActionIconType.WHATSAPP, "Whatsapp", true, handleWhatsappClick)}&nbsp;&nbsp;Whatsapp</span>
                </p>
            </div>
            <br/>
            <div className="flex-separated-items">
                <Image src={imageHelper.getImageFromClient("perfil-caricanecas.jpeg")}
                       fluid width="700" title="perfil caricanecas"/>
                <Image src={imageHelper.getImageFromClient("como-pedir-0.png")}
                       onClick={() => handleShowHowToOrder(true)}
                       fluid width="600" title="perfil caricanecas"/>
            </div>
            <br/>
            <Card border="dark" style={{ margin: "auto"}}>
                <Card.Header as="h3">Our Products</Card.Header>
                <Card.Body>
                    <div className="flex-card">
                        {products.map(p => {
                            return (
                                <ProductShowCaseRow key={p.product._id} product={p}/>
                            )
                        })}
                    </div>
                    <p style={{textAlign: "center", fontSize: "16px"}}>Clique na imagem para saber mais</p>
                </Card.Body>
            </Card>
            <Modal
                show={showHowToOrder}
                onHide={() => handleShowHowToOrder(false)}
                centered
                keyboard={true}
                size="lg">
                <Modal.Body>
                    <HowToOrderPresentation />
                </Modal.Body>
            </Modal>
            <Modal
                show={showFormQuote}
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