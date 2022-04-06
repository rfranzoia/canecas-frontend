import {useEffect, useState} from "react";

export const Button = (props) => {
    const [icon, setIcon] = useState(
        {
            type: "close",
            class: "fa fa-close",
            color: "#ff2e2e"
        }
    );

    const [btn, setBtn] = useState({
        backgroundColor: "#",
        border: "none",
        color: "white",
        padding: "",
        fontSize: "14px",
        cursor: "pointer",
    });

    const [hover, setHover] = useState(false);

    const types = [
        {type: "close", class: "fa fa-close", color: "#CC1819", hover: "#A31314"},
        {type: "save", class: "fa fa-save", color: "#1E90FF", hover: "#1873CC"},
        {type: "confirm", class: "fa fa-check", color: "#1E90FF", hover: "#1873CC"},
        {type: "add", class: "fa fa-plus", color: "#1E90FF", hover: "#1873CC"},
        {type: "new", class: "fa fa-plus", color: "#6AA84F", hover: "#55863F"},
        {type: "logout", class: "fa fa-sign-out", color: "#CC1819", hover: "#A31314"},
        {type: "login", class: "fa fa-user-lock", color: "#6AA84F", hover: "#55863F"},
        {type: "sign-in", class: "fa fa-user-lock", color: "#1E90FF", hover: "#1873CC"},
        {type: "sign-up", class: "fa fa-user-pen", color: "#1E90FF", hover: "#1873CC"},
        {type: "list", class: "fa fa-bars", color: "#F1C232", hover: "#C19B28"},
    ]

    useEffect(() => {
        const type = props.customType ?
            props.customType :
            types.find((t) => t.type === props.type);

        setIcon(type);

    }, [hover, props]);

    useEffect(() => {
        let padding = "12px 16px";
        if (props.size && props.size === "small") {
            padding = "7px 9px";
        }

        setBtn(prevState => {
            return {
                ...prevState,
                backgroundColor: hover ? icon.hover : icon.color,
                padding: padding,
            }
        })
    }, [icon, props.size, hover])

    const handleIn = () => {
        setHover(true);
    }

    const handleOut = () => {
        setHover(false);
    }

    return (
        <span onClick={props.onClick} onMouseOver={handleIn} onMouseOut={handleOut}>
            <button style={btn}>
                <i className={icon.class}></i>&nbsp;
                {props.caption}
            </button>
        </span>
    )
}