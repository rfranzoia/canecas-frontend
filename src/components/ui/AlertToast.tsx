import {Alert} from "react-bootstrap";
import {useContext} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";

export const AlertToast = (props) => {
    const appCtx = useContext(ApplicationContext);
    const customClass = props.className? props.className: "alert-top"
    return (
        <>
            { appCtx.alert.show &&
                (
                    <div>
                        <Alert variant={appCtx.alert.type} onClose={() => appCtx.handleAlert(false)} dismissible
                               transition className={customClass}>
                            <Alert.Heading>{appCtx.alert.title}</Alert.Heading>
                            <p>{appCtx.alert.message}</p>
                        </Alert>
                    </div>
                )
            }
        </>
    )
}