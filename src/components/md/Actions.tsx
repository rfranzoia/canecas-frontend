import {
    BiEdit,
    BiFastForwardCircle,
    BiTrash,
    BiUserCheck,
    MdPostAdd, RiDeleteBin2Line,
    VscCollapseAll, VscExpandAll
} from "react-icons/all";

export enum ButtonAction {
    EDIT,
    DELETE,
    USER_CHECK,
    ACTION_FORWARD,
    ADD_ITEM,
    EXPAND,
    COLLAPSE,
    CANCEL_ITEM
}

export const getActionIcon = (action: ButtonAction, title: string, canClick: boolean = false, onClick = () => undefined) => {
    switch (action) {
        case ButtonAction.EDIT:
            return (
                <BiEdit
                    title={title}
                    style={!canClick && {pointerEvents: "none"}}
                    color={!canClick ? "#a2a0a0" : "blue"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
        case ButtonAction.DELETE:
            return (
                <BiTrash
                    title={title}
                    style={!canClick && {pointerEvents: "none"}}
                    color={!canClick ? "#a2a0a0" : "red"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
        case ButtonAction.USER_CHECK:
            return (
                <BiUserCheck
                    title={title}
                    style={!canClick && {pointerEvents: "none"}}
                    color={!canClick ? "#a2a0a0" : "green"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
        case ButtonAction.ACTION_FORWARD:
            return (
                <BiFastForwardCircle
                    title={title}
                    style={!canClick && {pointerEvents: "none"}}
                    color={!canClick ? "#a2a0a0" : "orange"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
        case ButtonAction.ADD_ITEM:
            return (
                <MdPostAdd
                    title={title}
                    style={canClick && {pointerEvents: "none"}}
                    color={canClick ? "#a2a0a0" : "green"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
        case ButtonAction.EXPAND:
            return (
                <VscExpandAll
                    title={title}
                    style={canClick && {pointerEvents: "none"}}
                    color={canClick ? "#a2a0a0" : "green"}
                    onClick={onClick}
                    size="1.5em"
                    cursor="pointer"/>
            )
        case ButtonAction.COLLAPSE:
            return (
                <VscCollapseAll
                    title={title}
                    style={canClick && {pointerEvents: "none"}}
                    color={canClick ? "#a2a0a0" : "green"}
                    onClick={onClick}
                    size="1.5em"
                    cursor="pointer"/>
            )
        case ButtonAction.CANCEL_ITEM:
            return (
                <RiDeleteBin2Line
                    title={title}
                    style={!canClick && {pointerEvents: "none"}}
                    color={!canClick ? "#a2a0a0" : "red"}
                    onClick={onClick}
                    size="2em"
                    cursor="pointer"/>
            )
    }
}