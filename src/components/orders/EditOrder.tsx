import {ordersApi} from "../../api/OrdersAPI";
import {useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {EditOrderForm} from "./EditOrderForm";
import {StatusCodes} from "http-status-codes";
import {AlertToast} from "../ui/AlertToast";

export const EditOrder = (props) => {
    const appCtx = useContext(ApplicationContext);

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
                    appCtx.handleAlert(false);
                    handleSave(result._id);
                } else {
                    appCtx.handleAlert(true, AlertType.DANGER, result.name, result.description);
                }
            });
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleSave = (orderId: string) => {
        props.onSave(orderId);
    }


    useEffect(() => {
        if (!appCtx.userData.authToken) return;
        const loadData = async () => {
            const result = await ordersApi.withToken(appCtx.userData.authToken).get(props.id);

            if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
                appCtx.showErrorAlert(result.name, result.description);
            } else {
                if (result && !Array.isArray(result)) {
                    setOrder({
                        ...result,
                        orderDate: result.orderDate.split("T")[0]
                    });
                }
            }
        }
        loadData().then(() => undefined);

    }, [props.id, props.op, appCtx]);

    const title = props.op === "edit" ? "Edit" : "View";

    const handleOp = (order) => {
        if (props.op !== "view") {
            handleSaveOrder(order);
        }
    }

    return (
        <>
            {appCtx.alert.show &&
                <AlertToast/>
            }
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