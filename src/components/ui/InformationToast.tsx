import {Toast} from "react-bootstrap";

export const InformationToast = (props) => {
    const TOAST_TIMEOUT = 4 * 1000;

    return (
        <Toast show={props.show} onClose={props.onClose} delay={TOAST_TIMEOUT} autohide>
            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                <strong className="me-auto">{props.title}</strong>
                <small>{props.when} {props.icon}</small>
            </Toast.Header>
            <Toast.Body>{props.message}</Toast.Body>
        </Toast>
    );
}