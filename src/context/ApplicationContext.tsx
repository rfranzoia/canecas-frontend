import {createContext, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";

export interface GlobalAlert {
    show: boolean,
    type: string,
    title: string,
    message: string
}

export interface UserData {
    _id: string,
    name: string,
    email: string,
    role: string,
    authToken: string
}

export interface AppCtx {
    userData: UserData,
    alert: GlobalAlert,
    isLoggedIn: Function,
    handleAlert: Function,
    getToken: Function,
}

const defaultValue: AppCtx = {
    userData: {
        _id: "",
        name: "",
        email: "",
        role: "",
        authToken: ""
    },
    alert: {
        show: false,
        type: "",
        title: "",
        message: "",
    },
    isLoggedIn: () => {},
    handleAlert: () => {},
    getToken: () => {},
}

export const ALERT_TIMEOUT = 5 * 1000;

export enum AlertType { DANGER = "danger",
                        SUCCESS = "success",
                        WARNING = "warning",
                        INFO = "info",
                        }

export enum OpType { NEW = "new",
                        EDIT = "edit",
                        VIEW = "view",
                        DELETE = "delete",
                        UPDATE = "update",
                        CANCEL = "cancel",
                        SELECT = "select"
                        }

export const ApplicationContext = createContext(defaultValue);

export const ApplicationContextProvider = (props) => {
    const history = useHistory();

    const [userData, setUserData] = useState({
        _id: "",
        email: "",
        name: "",
        role: "",
        authToken: ""
    });

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const isLoggedIn = () => {
        return (userData.email !== "" && userData.authToken !== "");
    }

    const getToken = useCallback(() => {
        return userData.authToken;
    }, [userData.authToken]);

    const handleAlert = useCallback((show: boolean, type?: AlertType, title?: string, message?: string) => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });

        if (show) {
            let t = setTimeout(() => {
                handleAlert(false);
                clearTimeout(t);
            }, ALERT_TIMEOUT);
        }
    },[]);

    const isTokenValid = useCallback(async (token) => {
        const res = await usersApi.validateToken(token);
        return res.statusCode === StatusCodes.OK;
    }, [])

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
        if (!userData._id || !userData.authToken) {
            let t = setTimeout(() => {
                handleAlert(false);
                clearTimeout(t);
                if (history) history.replace("/");
            }, ALERT_TIMEOUT * 2);
        } else {
            isTokenValid(userData.authToken)
                .then(isValid => {
                    if (!isValid) {
                        handleAlert(true, AlertType.INFO, "Login Expired", "Authentication Expired");
                        let t = setTimeout(() => {
                            handleAlert(false);
                            setUserData({
                                _id: "",
                                email: "",
                                name: "",
                                role: "",
                                authToken: ""
                            });
                            clearTimeout(t);
                            if (history) history.replace("/");
                        }, ALERT_TIMEOUT);
                    }
                })
        }
    }, [userData, handleAlert, history, isTokenValid]);

    const context: AppCtx = {
        userData: userData,
        alert: alert,
        isLoggedIn: isLoggedIn,
        handleAlert: handleAlert,
        getToken: getToken,
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}

