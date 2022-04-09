import {ordersApi} from "../../api/OrdersAPI";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {FormEditOrder} from "./FormEditOrder";
import {useHistory, useParams} from "react-router-dom";
import {InformationToast} from "../ui/InformationToast";
import {StatusCodes} from "http-status-codes";

export const EditOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const history = useHistory();
    const params = useParams();

    const op = params["id"] ? "edit" : "view";
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
                    history.goBack();
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
        if (op === "edit") {
            history.goBack()
        } else {
            props.onSaveCancel();
        }
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
        const callback = async () => {
            let result;
            if (op === "edit") {
                result = await ordersApi.withToken(appCtx.userData.authToken).get(params["id"]);
            } else {
                result = await ordersApi.withToken(appCtx.userData.authToken).get(props.id);
            }
            if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
                appCtx.showErrorAlert(result.name, result.description);
            } else {
                setOrder(result);
            }
        }
        callback().then(() => undefined);

    }, [props.id, op, appCtx, params]);

    const title = op === "edit" ? "Edit" : "View";

    const handleOp = (order) => {
        if (op !== "view") {
            handleSaveOrder(order);
        }
    }

    return (
        <>
            <div>
                <FormEditOrder title={title} order={order} op={op} onSaveOrder={handleOp} onCancel={handleCancel}/>
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