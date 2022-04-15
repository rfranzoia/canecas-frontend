
export enum ButtonAction {
    EDIT,
    DELETE,
    USER_CHECK,
    ACTION_FORWARD,
    ADD_ITEM,
    EXPAND,
    COLLAPSE,
    CANCEL_ITEM,
    WHATSAPP,
    UNDO,
    IMAGE_EDIT
}

const matrix = [
    { type: ButtonAction.EDIT, class: "fa fa-pen-to-square", color: "blue", size: "2rem" },
    { type: ButtonAction.DELETE, class: "fa fa-trash-can", color: "red", size: "2rem" },
    { type: ButtonAction.USER_CHECK, class: "fa fa-user-check", color: "green", size: "2rem" },
    { type: ButtonAction.ACTION_FORWARD, class: "fa fa-forward", color: "orange", size: "2rem" },
    { type: ButtonAction.ADD_ITEM, class: "fa fa-cart-circle-plus", color: "blue", size: "2rem" },
    { type: ButtonAction.EXPAND, class: "fa fa-square-plus", color: "black", size: "1.5rem" },
    { type: ButtonAction.COLLAPSE, class: "fa fa-square-minus", color: "black", size: "1.5rem" },
    { type: ButtonAction.CANCEL_ITEM, class: "fa fa-trash", color: "red", size: "2rem" },
    { type: ButtonAction.IMAGE_EDIT, class: "fa fa-file-image", color: "blue", size: "2rem" },
    { type: ButtonAction.UNDO, class: "fa fa-rotate-left", color: "red", size: "2rem" },
    { type: ButtonAction.WHATSAPP, class: "fa-brands fa-whatsapp", color: "green", size: "2rem" },
]


export const getActionIcon = (action: ButtonAction, title: string, canClick: boolean = false, onClick = () => undefined) => {
    const icon = matrix.find(icon => icon.type === action)
    return (
        <button type="button" className="transparent-btn" onClick={onClick} title={title} disabled={!canClick}>
            <i className={icon.class}
               style={{
                   color: !canClick?"#a2a0a0":icon.color,
                   fontSize: icon.size}}
            />
        </button>
    )
}