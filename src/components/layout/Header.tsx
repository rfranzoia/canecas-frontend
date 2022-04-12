import {Alert, Container, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import { CustomButton } from "../ui/CustomButton";
import {ShowType, UserRegistration} from "../users/UserRegistration";

export const Header = () => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleClose = () => {
        setShowLoginModal(false);
    }

    const handleShowLogin = async () => {
        setShowLoginModal(true);
    }

    const handleLogout = () => {
        appCtx.removeUser();
        history.replace("/");
    }

    const handleDismissAlert = () => {
        appCtx.hideErrorAlert();
        appCtx.removeUser();
        history.replace("/")
    }

    return (
        <header>
            <Navbar className="color-nav" variant="dark" expand="lg" style={{ marginBottom: "0.5rem"}}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                        <Image src="http://192.168.1.116:3000/logo.jpg"
                               title="Canecas"
                                roundedCircle
                                width="55"/>
                        &nbsp;
                        Canecas
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll>
                            <Nav.Link as={Link} to="/">Início</Nav.Link>
                            {appCtx.isLoggedIn() &&
                                (
                                    <>
                                        <Nav.Link as={Link} to="/orders">Pedidos</Nav.Link>
                                        <NavDropdown title="Gerenciar" id="navbarScrollingDropdown">
                                            <NavDropdown.Item as={Link} to="/types">Tipos de Produto</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/products">Produtos</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={Link} to="/users">Usuários/Clientes</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                )
                            }
                        </Nav>
                        {appCtx.isLoggedIn() ?
                            (
                                <Navbar.Collapse className="justify-content-end">
                                    <Navbar.Text> {appCtx.userData.userEmail} </Navbar.Text>
                                    &nbsp;&nbsp;
                                    <CustomButton size="small" caption="Logout" onClick={handleLogout} type="logout"/>
                                </Navbar.Collapse>
                            ) :
                            (
                                <CustomButton size="small" caption="Login" onClick={handleShowLogin} type="login"/>
                            )
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showLoginModal &&
                <UserRegistration show={showLoginModal} handleClose={handleClose} showType={ShowType.SIGN_IN}/>
            }
            {appCtx.error.show &&
                <Alert variant="danger" onClose={handleDismissAlert} dismissible transition  className="alert-top">
                    <Alert.Heading>{appCtx.error.title}</Alert.Heading>
                    <p>{appCtx.error.message}</p>
                </Alert>
            }
        </header>
    );
}
