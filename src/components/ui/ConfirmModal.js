import {Modal} from "react-bootstrap";
import {Button} from "./Button";

export const ConfirmModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.message}</Modal.Body>
            <Modal.Footer>
                <Button caption="No" onClick={props.handleClose} type="close"/>
                <Button caption="Yes" onClick={props.handleConfirm} type="confirm"/>
            </Modal.Footer>
        </Modal>
    );
}