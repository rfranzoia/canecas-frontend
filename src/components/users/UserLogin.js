import {useEffect, useState} from "react";
import {UserLoginForm} from "./UserLoginForm";
import {Container, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";

export const UserLogin = (props) => {
    const history = useHistory();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        setShowLogin(props.show? props.show: true);
    }, [props.show]);

    const handleClose = () => {
        if (props.handleClose) {
            props.handleClose();
        } else {
            setShowLogin(false);
        }
        history.replace("/");
    }


    return (
        <Container>
            <Row>
                <UserLoginForm show={showLogin} handleClose={handleClose} />
            </Row>
        </Container>
    );
}