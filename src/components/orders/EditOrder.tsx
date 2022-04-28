import {ordersApi} from "../../api/OrdersAPI";
import {memo, useCallback, useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {AlertToast} from "../ui/AlertToast";
import EditOrderForm from "./EditOrderForm";
import {Order} from "../../domain/Order";

const EditOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [showAlert, setShowAlert] = useState(false);
    const { handleAlert, getToken } = appCtx;
    const [order, setOrder] = useState({
        _id: "",
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        status: 0,
        items: [],
        statusHistory: []
    });

    const handleCancel = () => {
        props.onCancel();
    }

    const handleSaveOrder = (order: Order) => {
        if (props.op !== "view") {
            props.onSave(order);
        }
    }

    const loadData = useCallback(async () => {
        if (!props.id) return;

        const result = await ordersApi.withToken(getToken()).get(props.id);
        if (result?.statusCode !== StatusCodes.OK) {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            setShowAlert(true);
        } else {
            if (result.data && !Array.isArray(result.data)) {
                setOrder({
                    ...result.data,
                    orderDate: result.data.orderDate.split("T")[0]
                });
            }
            setShowAlert(false);
        }
    }, [props.id, getToken, handleAlert])

    useEffect(() => {
        loadData().then(() => undefined);
    }, [loadData]);

    const title = props.op === "edit" ? "Edit" : "View";

    return (
        <>
            <AlertToast showAlert={showAlert}/>
            <div>
                <EditOrderForm title={title}
                               order={order}
                               op={props.op}
                               onSaveOrder={handleSaveOrder}
                               onCancel={handleCancel}/>
            </div>
        </>
    );
}

export default memo(EditOrder);