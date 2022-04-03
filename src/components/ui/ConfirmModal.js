import {Button, Modal} from "react-bootstrap";

export const ConfirmModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.message}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>No</Button>
                <Button variant="primary" onClick={props.handleConfirm}>Yes</Button>
            </Modal.Footer>
        </Modal>
    );
}