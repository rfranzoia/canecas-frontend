import {Alert} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {uiActions, ToastAlert, ALERT_TIMEOUT} from "../../store/uiSlice";
import {RootState} from "../../store";
import {useEffect} from "react";

export const AlertToast = (props) => {
    const customClass = "alert-top".concat(` ${props.className}`).trim();
    const alert = useSelector<RootState, ToastAlert>(state => state.ui.alert);
    const dispatch = useDispatch();

    useEffect(() => {
        if (alert.show && props.showAlert) {
            let t = setTimeout(() => {
                dispatch(uiActions.handleAlert({show:false}))
                clearTimeout(t);
            }, ALERT_TIMEOUT);
        }
    },[alert.show, dispatch, props.showAlert])

    return (
        <>
            { alert.show && props.showAlert &&
                <div>
                    <Alert variant={alert.type} onClose={() => dispatch(uiActions.handleAlert({show: false}))} dismissible
                           transition className={customClass}>
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            }
        </>
    )
}