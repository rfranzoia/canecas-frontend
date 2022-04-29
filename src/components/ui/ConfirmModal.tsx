import { Modal } from "react-bootstrap";
import { CustomButton } from "./CustomButton";

export const ConfirmModal = (props) => {
    return (
        <Modal show={props.show} onHide={props.handleClose} keyboard={true} centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{!props.hasData ? props.message : props.children}</Modal.Body>
            <div className="actions">
                <CustomButton caption="Yes" onClick={props.handleConfirm} type="confirm"/>
                <CustomButton caption="No" onClick={props.handleClose} type="close"/>
            </div>
        </Modal>
    );
}