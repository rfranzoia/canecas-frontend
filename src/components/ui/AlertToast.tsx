import {Alert} from "react-bootstrap";
import {useContext} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";

export const AlertToast = (props) => {
    const appCtx = useContext(ApplicationContext);
    const customClass = "alert-top".concat(` ${props.className}`).trim();
    const {handleAlert} = appCtx;
    return (
        <>
            { (appCtx.alert.show && props.showAlert) &&
                <div>
                    <Alert variant={appCtx.alert.type} onClose={() => handleAlert(false)} dismissible
                           transition className={customClass}>
                        <Alert.Heading>{appCtx.alert.title}</Alert.Heading>
                        <p>{appCtx.alert.message}</p>
                    </Alert>
                </div>
            }
        </>
    )
}