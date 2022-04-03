import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {ApplicationContext} from "../../store/application-context";
import {UserLogin} from "../users/UserLogin";

export const Header = (props) => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleClose = () => {
        setShowLoginModal(false);
    }

    const handleShowLogin = async (e) => {
        setShowLoginModal(true);
    }

    const handleLogout = () => {
        appCtx.removeUser();
        history.replace("/");
    }

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" style={{ marginBottom: "10px"}}>
                <Container fluid>
                    <Navbar.Brand href="#">Canecas</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link href="/">Home</Nav.Link>
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
                                    <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
                                </Navbar.Collapse>
                            ) :
                            (
                                <Button variant="outline-danger" onClick={handleShowLogin}>Login</Button>
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