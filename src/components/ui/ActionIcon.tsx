import styles from "./actionIcon.module.css";

export enum ActionIconType {
    EDIT,
    DELETE,
    USER_CHECK,
    ACTION_FORWARD,
    ACTION_BACKWARD,
    ADD_ITEM,
    EXPAND,
    COLLAPSE,
    CANCEL_ITEM,
    WHATSAPP,
    UNDO,
    IMAGE_EDIT,
    SEARCH,
    SELECT,
    CHANGE_PASSWORD,
}

const matrix = [
    { type: ActionIconType.EDIT, class: "fa fa-pen-to-square", color: "blue", size: "1.7rem" },
    { type: ActionIconType.DELETE, class: "fa fa-trash-can", color: "red", size: "1.7rem" },
    { type: ActionIconType.USER_CHECK, class: "fa fa-user-check", color: "green", size: "1.7rem" },
    { type: ActionIconType.ACTION_FORWARD, class: "fa fa-forward", color: "orange", size: "1.7rem" },
    { type: ActionIconType.ACTION_BACKWARD, class: "fa fa-backward", color: "orange", size: "1.7rem" },
    { type: ActionIconType.ADD_ITEM, class: "fa fa-cart-plus", color: "blue", size: "1.7rem" },
    { type: ActionIconType.SELECT, class: "fa fa-square-plus", color: "black", size: "1.5rem" },
    { type: ActionIconType.EXPAND, class: "fa fa-caret-down", color: "black", size: "1.5rem" },
    { type: ActionIconType.COLLAPSE, class: "fa fa-caret-up", color: "black", size: "1.5rem" },
    { type: ActionIconType.CANCEL_ITEM, class: "fa fa-trash", color: "red", size: "1.7rem" },
    { type: ActionIconType.IMAGE_EDIT, class: "fa fa-file-image", color: "blue", size: "1.7rem" },
    { type: ActionIconType.UNDO, class: "fa fa-rotate-left", color: "red", size: "1.7rem" },
    { type: ActionIconType.SEARCH, class: "fa fa-binoculars", color: "black", size: "1.5rem" },
    { type: ActionIconType.WHATSAPP, class: "fa-brands fa-whatsapp", color: "green", size: "1.7rem" },
    { type: ActionIconType.CHANGE_PASSWORD, class: "fa fa-lock-open", color: "green", size: "1.7rem" },
]

export interface CustomActionIcon {
    class: string,
    color: string,
    size: string
}

export interface ActionIconOption {
    title?: string,
    canClick?: boolean,
    onClick?: any,
    class?: string,
    color?: string,
    size?: string
}

export const getActionIcon = (actionIconType: ActionIconType, ...args) => {
    const icon = matrix.find(icon => icon.type === actionIconType);
    if (!icon) return null;

    // TODO: change components where the old argument passing is still being used to the new one
    let options = args[0];
    if (typeof options !== "object") {
        options = {
            title: args[0],
            canClick: args[1],
            onClick: args[2],
            size: icon.size,
            color: icon.color,
            class: icon.class
        }
    }

    return (
        <button type="button"
                className={styles["transparent-btn"]}
                onClick={options.onClick}
                title={options.title}
                disabled={!options.canClick}>
            <i className={options.class ? options.class : icon.class}
               style={{
                   color: !options.canClick ? "#a2a0a0" : options.color ? options.color : icon.color,
                   fontSize: options.size ? options.size : icon.size
               }}
            />
        </button>
    )
}