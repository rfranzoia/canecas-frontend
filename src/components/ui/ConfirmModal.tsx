import {Modal} from "react-bootstrap";
import {CustomButton} from "./CustomButton";

export const ConfirmModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} backdrop="static" keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.message}</Modal.Body>
            <Modal.Footer>
                <CustomButton caption="No" onClick={props.handleClose} type="close"/>
                <CustomButton caption="Yes" onClick={props.handleConfirm} type="confirm"/>
            </Modal.Footer>
        </Modal>
    );
}