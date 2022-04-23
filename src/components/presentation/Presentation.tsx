import {CustomButton} from "../ui/CustomButton";
import {Card, Image} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";
import {imageHelper} from "../ui/ImageHelper";
import {ProductShowCaseRow} from "./ProductShowCaseRow";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {HowToOrderPresentation} from "./HowToOrderPresentation";
import {OrderWizard} from "../orders/wizard/OrderWizard";
import Modal from "../ui/Modal";

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
        setProducts([]);
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
            { showHowToOrder &&
                <Modal onClose={() => handleShowHowToOrder(false)} >
                    <HowToOrderPresentation />
                </Modal>
            }
            { showFormQuote &&
                <Modal onClose={handleCancel} >
                    <OrderWizard onCancel={handleCancel}/>
                </Modal>
            }

        </div>
    );
}

/*
<Container fluid
           style={{padding: "1rem", display: "flex", justifyContent: "center", width: "auto"}}>
    <Row>
        <Col md="auto">
            <QuoteRequestForm onConfirm={handleConfirm} onCancel={handleCancel}/>

        </Col>
    </Row>
</Container>
 */