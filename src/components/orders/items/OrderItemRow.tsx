import { useEffect, useState } from "react";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";

export const OrderItemRow = (props) => {
    const [item, setItem] = useState({
        product: "",
        caricature: 0,
        caricatureImages: null,
        background: "",
        backgroundImage: null,
        price: 0,
        amount: 0,
    });

    useEffect(() => {
        setItem({
            product: props.item.product,
            caricature: props.item.caricature,
            caricatureImages: props.item.caricatureImages,
            background: props.item.background,
            backgroundImage: props.item.backgroundImage,
            price: +props.item.price,
            amount: +props.item.amount
        })
    }, [props.item]);

    return (
        <tr key={props.item._id} style={{ verticalAlign: "middle" }}>
            <td>{item.product}</td>
            <td style={{ textAlign: "center" }}>{item.caricature}</td>
            <td style={{ textAlign: "center" }}>{item.background}</td>
            <td style={{ textAlign: "right" }}>{item.price.toFixed(2)}</td>
            <td style={{ textAlign: "right" }}>{item.amount}</td>
            <td>
                {
                    getActionIcon(ActionIconType.DELETE,
                        "Delete Item",
                        !props.viewOnly,
                        () => props.onDelete(props.item._id))
                }
            </td>
        </tr>
    );
}