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
    userId: string,
    name: string,
    userEmail: string,
    role: string,
    authToken: string
}

export interface AppCtx {
    userData: UserData,
    alert: GlobalAlert,
    addUser: Function,
    removeUser: Function,
    isLoggedIn: Function,
    handleAlert: Function,
    getToken: Function,
}

const defaultValue: AppCtx = {
    userData: {
        userId: "",
        name: "",
        userEmail: "",
        role: "",
        authToken: ""
    },
    alert: {
        show: false,
        type: "",
        title: "",
        message: "",
    },
    addUser: () => {},
    removeUser: () => {},
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
        userId: "",
        userEmail: "",
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

    const addUser = (user) => {
        setUserData({
            userId: user.userId,
            name: user.name,
            userEmail: user.userEmail,
            role: user.role,
            authToken: user.authToken
        })
    }

    const removeUser = () => {
        setUserData({
            userId: "",
            userEmail: "",
            name: "",
            role: "",
            authToken: ""
        });
    }

    const isLoggedIn = () => {
        return (userData.userEmail !== "" && userData.authToken !== "");
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

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("userData"));
        if (storage) {
            addUser(storage);
        }
    }, []);

    const isTokenValid = useCallback(async (token) => {
        const res = await usersApi.validateToken(token);
        return res.statusCode === StatusCodes.OK;
    }, [])

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
        if (!userData.userId || !userData.authToken) {
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
                            removeUser();
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
        addUser: addUser,
        removeUser: removeUser,
        handleAlert: handleAlert,
        getToken: getToken,
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}

