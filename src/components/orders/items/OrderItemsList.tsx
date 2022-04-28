import {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import {OrderItemRow} from "./OrderItemRow";
import {OrderItemWizard} from "./OrderItemWizard";
import Modal from "../../ui/Modal";
import {ActionIconType, getActionIcon} from "../../ui/ActionIcon";

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
            <div><h5>Items
                <span aria-hidden="true" className="required">*</span>
            </h5></div>
            <div>
                { showModal &&
                    <Modal
                        onClose={handleCloseModal} >
                        <OrderItemWizard onCancel={handleCloseModal} onItemAdd={handleItemAdded} />
                    </Modal>
                }

                <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                        <th style={{ width: "30%" }}>Product</th>
                        <th style={{ width: "5%", textAlign: "center" }}>Drawings</th>
                        <th style={{ width: "5%", textAlign: "center" }}>Background</th>
                        <th style={{ width: "10%", textAlign: "right" }}>Price</th>
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
            {!props.viewOnly &&
                <div>
                    <hr />
                    {
                        getActionIcon(ActionIconType.ADD_ITEM,
                            "Add Item",
                            true,
                            () => handleShowModal())
                    }

                </div>
            }
        </div>
    )
}