import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OrderItemRow } from "./OrderItemRow";

export const OrderItemsList = (props) => {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        setOrderItems([
            ...props.items
        ]);
    }, [props.items]);

    return (
        <div>
            <div>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th style={{ width: "25%" }}>Product</th>
                        <th style={{ width: "5%", textAlign: "center" }}>Caricatures</th>
                        <th style={{ width: "5%", textAlign: "center" }}>Background</th>
                        <th style={{ width: "17%" }}>Description</th>
                        <th style={{ width: "5%", textAlign: "right" }}>Price</th>
                        <th style={{ width: "5%", textAlign: "right" }}>Amount</th>
                        <th style={{ width: "5%" }}>&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderItems.map(item => (
                        <OrderItemRow key={item._id}
                                      viewOnly={props.viewOnly}
                                      item={item}
                                      onDelete={() => props.onItemRemove(item._id)}/>
                    ))}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}