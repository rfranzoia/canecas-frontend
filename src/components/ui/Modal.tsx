import { memo, PropsWithChildren, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import classes from "./modal.module.css";

interface ModalProps {
    keyboard?: string,
    size?: string,
    style?: object,
    onClose: Function,
}

const Backdrop = (props) => {
    return <div className={classes.backdrop} onClick={props.onClose}/>;
};

const ModalOverlay = (props: PropsWithChildren<ModalProps>) => {
    const classSize = "modal".concat(props.size ? `-${props.size}` : "");

    return (
        <div className={`${classes.modal} ${classes[classSize]}`} {...props}>
            <div className={classes.content}>{props.children}</div>
        </div>
    );
};

const portalElement = document.getElementById('overlays');

const Modal = (props: PropsWithChildren<ModalProps>) => {
    const { onClose, keyboard } = props;

    const close = useCallback((e) => {
        if (e.keyCode === 27) onClose();
    }, [onClose]);

    useEffect(() => {
        if (keyboard) {
            window.addEventListener("keydown", close);
        }
        return (() => window.removeEventListener("keydown", close))
    },[close, keyboard, onClose]);

    return (
        <>
            {ReactDOM.createPortal(<Backdrop onClose={props.onClose}/>, portalElement)}
            {ReactDOM.createPortal(
                <ModalOverlay {...props}>{props.children}</ModalOverlay>,
                portalElement
            )}
        </>
    );
};

export default memo(Modal);