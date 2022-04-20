import classes from "./modal.module.css";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}/>;
};

const ModalOverlay = (props) => {
    const classSize = "modal".concat(props.size?`-${props.size}`:"");
    return (
        <div className={classes[classSize]} {...props}>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
    return (
        <>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
            {ReactDOM.createPortal(
                <ModalOverlay {...props}>{props.children}</ModalOverlay>,
                portalElement
            )}
        </>
    );
};

export default Modal;