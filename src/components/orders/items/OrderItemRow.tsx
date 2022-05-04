import { useEffect, useState } from "react";
import { ActionIconType, getActionIcon } from "../../ui/ActionIcon";

export const OrderItemRow = (props) => {
    const [item, setItem] = useState({
        product: "",
        caricatures: 0,
        caricatureImages: null,
        background: "",
        backgroundImage: null,
        backgroundDescription: "",
        price: 0,
        amount: 0,
    });

    useEffect(() => {
        setItem({
            ...props.item,
        })
    }, [props.item]);

    const backgroundDescription = (!item.backgroundDescription)?"":
                                  (item.backgroundDescription.length <= 20)? item.backgroundDescription:
                                      item.backgroundDescription.substring(0, 18).concat("...");

    return (
        <tr key={props.item._id} style={{ verticalAlign: "middle" }}>
            <td>{item.product}</td>
            <td style={{ textAlign: "center" }}>{item.caricatures}</td>
            <td style={{ textAlign: "center" }}>{item.background}</td>
            <td>{backgroundDescription}</td>
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