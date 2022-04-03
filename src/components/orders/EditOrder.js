import {ordersApi} from "../../api/OrdersAPI";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../store/application-context";
import {FormEditOrder} from "./FormEditOrder";
import {useHistory, useParams} from "react-router-dom";
import {InformationToast} from "../ui/InformationToast";

export const EditOrder = (props) => {
    const appCtx = useContext(ApplicationContext);
    const history = useHistory();
    const params = useParams();

    const op = params.id ? "edit" : "view";
    const [order, setOrder] = useState({
        _id: "",
        orderDate: "",
        userEmail: "",
        totalPrice: 0,
        status: 0,
        items: []
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
            let o = {};
            if (op === "edit") {
                o = await ordersApi.withToken(appCtx.userData.authToken).get(params.id);
            } else {
                o = await ordersApi.withToken(appCtx.userData.authToken).get(props.id);
            }
            setOrder(o);
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, op, appCtx.userData.authToken, params.id]);

    const title = op === "new" ? "New" :
        op === "edit" ? "Edit" : "View";

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