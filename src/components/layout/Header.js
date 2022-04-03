import {Button, Container, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {UserLogin} from "../users/UserLogin";

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

    return (
        <header>
            <Navbar className="color-nav" variant="dark" expand="lg" style={{ marginBottom: "0.5rem"}}>
                <Container fluid>
                    <Navbar.Brand href="#">
                        <Image src="http://192.168.1.116:3000/canecas.jpeg"
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
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            {appCtx.isLoggedIn() &&
                                (
                                    <>
                                        <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                                        <NavDropdown title="Manage" id="navbarScrollingDropdown">
                                            <NavDropdown.Item as={Link} to="/types">Product Types</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/products">Products</NavDropdown.Item>
                                            <NavDropdown.Divider />
                                            <NavDropdown.Item as={Link} to="/users">Users</NavDropdown.Item>
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
                                    <Button variant="danger" onClick={handleLogout}>Logout</Button>
                                </Navbar.Collapse>
                            ) :
                            (
                                <Button variant="success" onClick={handleShowLogin}>Login</Button>
                            )
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showLoginModal &&
                <UserLogin show={showLoginModal} handleClose={handleClose}/>}
        </header>
    );
}