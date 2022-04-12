import {useEffect, useState} from "react";
import {BiTrash} from "react-icons/all";

export const OrderItemRow = (props) => {
    const [item, setItem] = useState({
        product: "",
        price: 0,
        amount: 0
    });

    useEffect(() => {
        setItem({
            product: props.item.product,
            price: props.item.price,
            amount: props.item.amount
        })
    },[props.item]);

    return (
        <tr key={props.item._id} style={{verticalAlign: "middle"}}>
            <td>{item.product}</td>
            <td>{item.price.toFixed(2)}</td>
            <td>{item.amount}</td>
            <td>
                <BiTrash
                    onClick={props.onDelete}
                    style={props.viewOnly && { pointerEvents: "none" }}
                    title="Remover Item"
                    size="2em"
                    cursor="pointer"
                    color={props.viewOnly?"#a2a0a0":"red"}/>
            </td>
        </tr>
    );
}