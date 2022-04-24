import {ordersApi} from "../../api/OrdersAPI";
import {memo, useCallback, useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {AlertToast} from "../ui/AlertToast";
import EditOrderForm from "./EditOrderForm";

const EditOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const { handleAlert } = appCtx;
    const [order, setOrder] = useState({
        _id: "",
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        status: 0,
        items: [],
        statusHistory: []
    });

    const handleSaveOrder = (order) => {
        ordersApi.withToken(appCtx.userData.authToken).update(order._id, order)
            .then(result => {
                if (result._id) {
                    handleAlert(false);
                    props.onSaveSuccessful(result._id);
                } else {
                    handleAlert(true, AlertType.DANGER, result.name, result.description);
                }
            });
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleOp = (order) => {
        if (props.op !== "view") {
            handleSaveOrder(order);
        }
    }

    const loadData = useCallback(async () => {
        if (!props.id) return;

        const result = await ordersApi.withToken(appCtx.userData.authToken).get(props.id);

        if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
            handleAlert(true, AlertType.DANGER, result.name, result.description)
        } else {
            if (result && !Array.isArray(result)) {
                setOrder({
                    ...result,
                    orderDate: result.orderDate.split("T")[0]
                });
            }
        }
    }, [props.id, appCtx.userData.authToken, handleAlert])

    useEffect(() => {
        loadData().then(() => undefined);
    }, [loadData]);

    const title = props.op === "edit" ? "Edit" : "View";

    return (
        <>
            {appCtx.alert.show && <AlertToast/>}
            <div>
                <EditOrderForm title={title}
                               order={order}
                               op={props.op}
                               onSaveOrder={handleOp}
                               onCancel={handleCancel}/>
            </div>
        </>
    );
}

export default memo(EditOrder);