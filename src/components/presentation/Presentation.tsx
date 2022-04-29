import {CustomButton} from "../ui/CustomButton";
import {Card, Image} from "react-bootstrap";
import {useCallback, useEffect, useState} from "react";
import Modal from "../ui/Modal";
import {AlertToast} from "../ui/AlertToast";
import {imageHelper} from "../ui/ImageHelper";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {HowToOrderPresentation} from "./HowToOrderPresentation";
import {OrderWizard} from "../orders/wizard/OrderWizard";
import {ProductShowCaseRow} from "./ProductShowCaseRow";
import {StatusCodes} from "http-status-codes";
import {productsApi} from "../../api/ProductsAPI";
import {useDispatch} from "react-redux";
import {AlertType, uiActions} from "../../store/uiSlice";

export const Presentation = () => {
    const [showFormQuote, setShowFormQuote] = useState(false);
    const [products, setProducts] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showHowToOrder, setShowHowToOrder] = useState(false);
    const dispatch = useDispatch();

    const handleShowRequestQuote = () => {
        setShowFormQuote(true);
    }

    const handleConfirm = () => {
        dispatch(uiActions.handleAlert({show:true, type:AlertType.SUCCESS, title:"Request Quote",
            message:"Congratulations! Your quote has been sent. You'll be hearing from us soon"}));
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

    const loadProducts = useCallback(async () => {
        const products = await productsApi.list();
        if (products.statusCode !== StatusCodes.OK) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.DANGER, title:"Load Products: ".concat(products.name), message:products.description}));
            setProducts([]);
            return
        } else {
            setProducts(products.data);
        }
    }, [dispatch]);

    useEffect(() => {
        loadProducts().then(undefined);
    }, [loadProducts])

    return (
        <div>
            <AlertToast showAlert={showAlert}/>
            <div>
                <h1>Caricanecas Manauara</h1>
                <p style={{textAlign: "center"}}>Caricanecas Manaus/AM<br/>
                    ✏️ Usamos a arte para encantar com um produto que é a sua cara!
                    Um brinde que é a sua cara!❤️<br/>
                    Gostou da ideia? Peça uma cotação pra gente!👇
                </p>
                <div className="d-flex justify-content-center">
                    <CustomButton caption="Request Quote" customClass="fa fa-money-check-dollar"
                                  onClick={handleShowRequestQuote} type="custom-success"/>
                </div>
                <p style={{textAlign: "center"}}>You can also send us a message on &nbsp;
                    <span style={{cursor: "pointer"}} onClick={handleWhatsappClick}>{getActionIcon(ActionIconType.WHATSAPP, "Whatsapp", true, handleWhatsappClick)}&nbsp;&nbsp;Whatsapp</span>
                </p>
            </div>
            <br/>
            <div className="d-flex justify-content-evenly">
                <div>
                    <p className="text-center">Our Social Network links</p>
                    <Image src={imageHelper.getImageFromClient("perfil-caricanecas.jpeg")}
                           fluid width="550" title="perfil caricanecas"/>
                </div>
                <div>
                    <p className="text-center">Click and check it out our ordering process</p>
                    <Image src={imageHelper.getImageFromClient("como-pedir-0.png")}
                           onClick={() => handleShowHowToOrder(true)}
                           fluid width="550" title="perfil caricanecas"/>
                </div>
            </div>
            <br/>
            <Card border="dark">
                <Card.Header as="h3">Our Products</Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-center gap-4 flex-wrap">
                        {products.map(p => {
                            return (
                                <ProductShowCaseRow key={p._id} product={p}/>
                            )
                        })}
                    </div>
                    <br/>
                    <p style={{textAlign: "center", fontSize: "16px"}}>For a list of available options click on the image</p>
                </Card.Body>
            </Card>
            { showHowToOrder &&
                <Modal onClose={() => handleShowHowToOrder(false)} >
                    <HowToOrderPresentation />
                </Modal>
            }
            { showFormQuote &&
                <Modal onClose={handleCancel} >
                    <OrderWizard onCancel={handleConfirm}/>
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