import {useEffect, useState} from "react";
import {BiTrash} from "react-icons/bi";

export const OrderItemRow = (props) => {
    const [item, setItem] = useState({
        product: "",
        drawings: 0,
        drawingsImages: null,
        background: "",
        backgroundImage: null,
        price: 0,
        amount: 0,
    });

    useEffect(() => {
        setItem({
            product: props.item.product,
            drawings: props.item.drawings,
            drawingsImages: props.item.drawingsImages,
            background: props.item.background,
            backgroundImage: props.item.backgroundImage,
            price: +props.item.price,
            amount: +props.item.amount
        })
    },[props.item]);

    return (
        <tr key={props.item._id} style={{verticalAlign: "middle"}}>
            <td>{item.product}</td>
            <td style={{ textAlign: "center"}}>{item.drawings}</td>
            <td style={{ textAlign: "center"}}>{item.background}</td>
            <td style={{ textAlign: "right"}}>{item.price.toFixed(2)}</td>
            <td style={{ textAlign: "right"}}>{item.amount}</td>
            <td>
                <BiTrash
                    onClick={props.onDelete}
                    style={props.viewOnly && { pointerEvents: "none" }}
                    title="Delete Item"
                    size="2em"
                    cursor="pointer"
                    color={props.viewOnly?"#a2a0a0":"red"}/>
            </td>
        </tr>
    );
}