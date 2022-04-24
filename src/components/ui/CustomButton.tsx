import {useEffect, useState} from "react";
import {Button} from "react-bootstrap";
import styles from "./customButton.module.css"

export interface ButtonType {
    type: string,
    class: string,
    variant: string
}

export const CustomButton = (props: any) => {
    const [buttonType, setButtonType] = useState({
        type: "save",
        class: "fa fa-confirm",
        variant: "light"
    });

    const findButtonType = (type: string): ButtonType => {
        const buttonTypes: ButtonType[] = [
            { type: "save", class: "fa fa-save", variant: "primary" },
            { type: "confirm", class: "fa fa-check", variant: "primary" },
            { type: "sign-in", class: "fa fa-user-lock", variant: "primary" },
            { type: "sign-up", class: "fa fa-user-pen", variant: "primary" },
            { type: "add", class: "fa fa-plus", variant: "primary" },
            { type: "close", class: "fa fa-close", variant: "danger" },
            { type: "logout", class: "fa fa-sign-out", variant: "danger" },
            { type: "new", class: "fa fa-plus", variant: "success" },
            { type: "login", class: "fa fa-user-lock", variant: "success" },
            { type: "list", class: "fa fa-bars", variant: "warning" },
            { type: "custom-primary", class: "fa fa-user-check", variant: "primary" },
            { type: "custom-secondary", class: "fa fa-confirm", variant: "secondary" },
            { type: "custom-danger", class: "fa fa-close", variant: "danger" },
            { type: "custom-warning", class: "fa fa-confirm", variant: "warning" },
            { type: "custom-success", class: "fa fa-confirm", variant: "success" },
            { type: "custom-info", class: "fa fa-confirm", variant: "info" },
            { type: "custom-light", class: "fa fa-confirm", variant: "light" },
        ]

        return buttonTypes.find((bt) => bt.type === type);
    }

    useEffect(() => {
        let bt: ButtonType = findButtonType(props.type);
        if (props.customClass) {
            bt = {
                ...bt,
                class: props.customClass
            }
        }
        setButtonType(bt);
    }, [props]);

    return (
        <Button onClick={props.onClick} variant={buttonType.variant} className={styles.button} disabled={props.disabled}>
            <i className={buttonType.class}>&nbsp;</i>
            {props.caption}
        </Button>
    )
}
