import {ordersApi} from "../../api/OrdersAPI";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {EditOrderForm} from "./EditOrderForm";
import {InformationToast} from "../ui/InformationToast";
import {StatusCodes} from "http-status-codes";

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

    const [toast, setToast] = useState({
        show: false,
        onClose: () => undefined,
        title: "",
        message: "",
        when: ""
    });

    const handleSaveOrder = (order) => {
        ordersApi.withToken(appCtx.userData.authToken).update(order._id, order)
            .then(result => {
                if (result._id) {
                    handleCloseToast();
                    handleSave(result._id);
                } else {
                    const error = result?.response?.data
                    setToast({
                        show: true,
                        onClose: () => handleCloseToast(),
                        title: "Create Order",
                        message: error.description,
                        when: error.name
                    })
                }
            });
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const handleSave = (orderId: string) => {
        props.onSave(orderId);
    }

    const handleCloseToast = () => {
        setToast({
            show: false,
            onClose: () => undefined,
            title: "",
            message: "",
            when: ""
        });
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
            <div>
                <EditOrderForm title={title} order={order} op={props.op} onSaveOrder={handleOp}
                               onCancel={handleCancel}/>
            </div>
            <div>
                <InformationToast
                    show={toast.show}
                    onClose={toast.onClose}
                    title={toast.title}
                    message={toast.message}
                    when={toast.when}/>
            </div>
        </>
    );
}