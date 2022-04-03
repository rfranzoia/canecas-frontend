import {useEffect, useState} from "react";
import { Modal, Table} from "react-bootstrap";
import {OrderItemRow} from "./OrderItemRow";
import {NewOrderItem} from "./NewOrderItem";
import {BiAddToQueue} from "react-icons/all";

export const OrderItemsList = (props) => {
    const [orderItems, setOrderItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setOrderItems([
            ...props.items
        ]);
    }, [props.items]);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
      setShowModal(false);
    }

    const handleItemAdded = (item) => {
        setShowModal(false);
        props.onItemAdd(item);
    }

    return (
        <div>
            <div><h5>Items</h5></div>
            <div>
                <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    backdrop="static"
                    keyboard={true}
                    centered>
                    <Modal.Body>
                        <NewOrderItem onItemAdd={handleItemAdded} onCancelItemAdd={handleCloseModal}/>
                    </Modal.Body>
                </Modal>
                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th width="20%">Product</th>
                        <th width="10%">Price</th>
                        <th width="10%">Amount</th>
                        <th width="5%">&nbsp;</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderItems.map(item => (
                        <OrderItemRow key={item._id} viewOnly={props.viewOnly} item={item} onDelete={() => props.onItemRemove(item._id)}/>
                    ))}
                    </tbody>
                </Table>
            </div>
            <div>
                <hr />
                <BiAddToQueue
                    onClick={handleShowModal}
                    style={props.viewOnly && { pointerEvents: "none" }}
                    title="Add Item"
                    size="2em"
                    cursor="pointer"
                    color={props.viewOnly?"#a2a0a0":"blue"}/>
            </div>
        </div>
    )
}