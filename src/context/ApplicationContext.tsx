import {createContext, useEffect, useState} from "react";

export interface GlobalError {
    show: boolean,
    title: string,
    message: string
}

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
    error: GlobalError,
    alert: GlobalAlert,
    addUser: Function,
    removeUser: Function,
    isLoggedIn: Function,
    showErrorAlert: Function,
    hideErrorAlert: Function,
    handleAlert: Function
}

const defaultValue: AppCtx = {
    userData: {
        userId: "",
        name: "",
        userEmail: "",
        role: "",
        authToken: ""
    },
    error: {
        show: false,
        title: "",
        message: ""
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
    showErrorAlert: () => {},
    hideErrorAlert: () => {},
    handleAlert: () => {}
}

export const ALERT_TIMEOUT = 3 * 1000;

export enum AlertType { NONE = "", DANGER = "danger", SUCCESS = "success", WARNING = "warning", INFO = "info" }

export enum OpType { EDIT = "edit", VIEW = "view", DELETE = "delete", UPDATE = "update", CANCEL = "cancel" }

export const ApplicationContext = createContext(defaultValue);

export const ApplicationContextProvider = (props) => {
    const [error, setError] = useState({
        show: false,
        title: "",
        message: ""
    });

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

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("userData"));
        if (storage) {
            setUserData(storage)
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
    }, [userData]);

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

    const showErrorAlert = (title, message) => {
        setError({
            show: true,
            title: title,
            message: message
        });
    }

    const hideErrorAlert = () => {
        setError({
            show: false,
            title: "",
            message: ""
        });
    }

    const handleAlert = (show: boolean, type: AlertType = AlertType.NONE, title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
            }, ALERT_TIMEOUT);
        }
    };

    const context: AppCtx = {
        userData: userData,
        error: error,
        alert: alert,
        isLoggedIn: isLoggedIn,
        addUser: addUser,
        removeUser: removeUser,
        showErrorAlert: showErrorAlert,
        hideErrorAlert: hideErrorAlert,
        handleAlert: handleAlert
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}