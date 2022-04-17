import {Alert, Container, Dropdown, Image, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import { CustomButton } from "../ui/CustomButton";
import {ShowType, UserRegistration} from "../users/UserRegistration";
import {Role} from "../../domain/User";
import {EditUser} from "../users/EditUser";
import {AlertToast} from "../ui/AlertToast";
import {ChangeUserPassword} from "../users/ChangeUserPassword";
import {API_SERVER_ADDRESS} from "../../api/axios";

export const Header = () => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
            setShowAlert(true);
        }
    };

    const handlePasswordChanged = () => {
        setShowChangePassword(false);
        appCtx.handleAlert(true, AlertType.SUCCESS, "Password Update", "User password has been updated successfully");
        setShowAlert(true);
    }

    const adminUser = (
        <>
            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
            <NavDropdown title="Manage" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/types">Types</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products">Products</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/users">Users</NavDropdown.Item>
            </NavDropdown>
        </>
    )

    const simpleUser = (
        <>
            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
            <NavDropdown title="Manage" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/types">Types</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/products">Products</NavDropdown.Item>
            </NavDropdown>
        </>
    )

    return (
        <header>
            {showAlert && <AlertToast/>}
            <Navbar className="color-nav" variant="dark" expand="lg" style={{ marginBottom: "0.5rem"}}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                            <Image src={`${API_SERVER_ADDRESS}/logo.jpg`}
                                   title="Caricanecas Manauara"
                                    roundedCircle
                                    width="55"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            >

                            {appCtx.isLoggedIn() && appCtx.userData.role === Role.ADMIN && adminUser }
                            {appCtx.isLoggedIn() && appCtx.userData.role !== Role.ADMIN && simpleUser }

                        </Nav>
                        {appCtx.isLoggedIn() ?
                            (
                                <>
                                    <Navbar.Collapse className="justify-content-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                {appCtx.userData.name}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => setShowEditModal(true)}>Profile</Dropdown.Item>
                                                <Dropdown.Item onClick={() => setShowChangePassword(true)}>Change Password</Dropdown.Item>
                                                <Dropdown.Divider />
                                                <Dropdown.Item onClick={handleLogout} >Logout</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Navbar.Collapse>
                                </>
                            ) :
                            (
                                <CustomButton caption="Sign In" onClick={handleShowLogin} type="login"/>
                            )
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {showLoginModal &&
                <UserRegistration show={showLoginModal} handleClose={handleClose} showType={ShowType.SIGN_IN}/>
            }
            {showEditModal &&
                <div>
                    <Modal
                        show={showEditModal}
                        onHide={handleCloseEditModal}
                        backdrop="static"
                        centered
                        style={{ justifyItems: "center", margin: "auto"}}
                        size="lg"
                        keyboard={true}>
                        <Modal.Body>
                            <div className="container4">
                                <EditUser id={appCtx.userData.userId} op="edit" onSaveCancel={handleCloseEditModal}/>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            }
            { showChangePassword &&
                <div>
                    <Modal
                        show={showChangePassword}
                        onHide={() => setShowChangePassword(false)}
                        backdrop="static"
                        centered
                        keyboard={true}
                        style={{ margin: "auto", alignContent: "center", justifyItems: "center" }}>
                        <Modal.Body>
                            <div className="container4">
                                <ChangeUserPassword email={appCtx.userData.userEmail} onCancel={() => setShowChangePassword(false)} onSave={handlePasswordChanged}/>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
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
