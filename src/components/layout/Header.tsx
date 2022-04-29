import {Container, Dropdown, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {useContext, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import { CustomButton } from "../ui/CustomButton";
import {ShowType, UserRegistration} from "../users/UserRegistration";
import {Role, User} from "../../domain/User";
import {EditUser} from "../users/EditUser";
import {AlertToast} from "../ui/AlertToast";
import {ChangeUserPassword} from "../users/ChangeUserPassword";
import {CONTENT_SERVER_ADDRESS} from "../../api/axios";
import Modal from "../ui/Modal";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../store/authSlice";
import {RootState} from "../../store";

export const Header = () => {
    const history = useHistory();
    const appCtx = useContext(ApplicationContext);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const {handleAlert} = appCtx;
    const dispatch = useDispatch();
    const isLoggedIn = useSelector<RootState, Boolean>(state => state.auth.isLoggedIn);
    const user = useSelector<RootState, User>(state => state.auth.user);

    const handleClose = () => {
        setShowLoginModal(false);
    }

    const handleShowLogin = async () => {
        setShowLoginModal(true);
    }

    const handleLogout = () => {
        dispatch(authActions.logout());
        history.replace("/");
    }

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            if (error.name && error.description) {
                handleAlert(true, AlertType.DANGER, error.name, error.description);
                setShowAlert(true);
            } else {
                console.warn("warning", error);
            }
        }
    };

    const handlePasswordChanged = () => {
        setShowChangePassword(false);
        handleAlert(true, AlertType.SUCCESS, "Password Update", "User password has been updated successfully");
        setShowAlert(true);
    }

    const adminUser = (
        <>
            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
            <NavDropdown title="Manage" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/products">Products</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/variations">Product Variations</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/users">Users</NavDropdown.Item>
            </NavDropdown>
        </>
    )

    const simpleUser = (
        <>
            <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
            <NavDropdown title="Manage" id="navbarScrollingDropdown">
                <NavDropdown.Item as={Link} to="/products">Products</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/variations">Product Variations</NavDropdown.Item>
            </NavDropdown>
        </>
    )

    return (
        <header>
            {(showAlert || (appCtx.alert.show && appCtx.alert.type === AlertType.INFO)) && <AlertToast showAlert={showAlert}/>}
            <Navbar className="color-nav" variant="dark" expand="lg" style={{ marginBottom: "0.5rem"}}>
                <Container fluid>
                    <Navbar.Brand as={Link} to="/">
                            <Image src={`${CONTENT_SERVER_ADDRESS}/logo.jpg`}
                                   title="Caricanecas Manauara"
                                    roundedCircle
                                    width="55"/>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >

                            {isLoggedIn && user.role === Role.ADMIN && adminUser }
                            {isLoggedIn && user.role !== Role.ADMIN && simpleUser }

                        </Nav>
                        {isLoggedIn ?
                            (
                                <>
                                    <Navbar.Collapse className="justify-content-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                {user.name}
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
                        onClose={handleCloseEditModal}
                        size="sm" >
                        <div>
                            <EditUser id={user._id} op="edit" onCloseModal={handleCloseEditModal}/>
                        </div>
                    </Modal>
                </div>
            }
            { showChangePassword &&
                <div>
                    <Modal
                        onClose={() => setShowChangePassword(false)}
                        size="tn" >
                        <div>
                            <ChangeUserPassword email={user.email} onCancel={() => setShowChangePassword(false)} onSave={handlePasswordChanged}/>
                        </div>
                    </Modal>

                </div>
            }
        </header>
    );
}
