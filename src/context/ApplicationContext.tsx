import {createContext, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";
import {useHistory} from "react-router-dom";

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
    handleAlert: Function,
    checkValidLogin: Function
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
    handleAlert: () => {},
    checkValidLogin: () => {}
}

export const ALERT_TIMEOUT = 10 * 1000;

export enum AlertType { NONE = "", DANGER = "danger", SUCCESS = "success", WARNING = "warning", INFO = "info" }

export enum OpType { NEW = "new", EDIT = "edit", VIEW = "view", DELETE = "delete", UPDATE = "update", CANCEL = "cancel" }

export const ApplicationContext = createContext(defaultValue);

export const ApplicationContextProvider = (props) => {
    const history = useHistory();

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
        setTimeout(() => {
            hideErrorAlert();
        }, ALERT_TIMEOUT * 2);
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

    const checkValidLogin = async () => {
        if (!userData || !userData.userId || !userData.authToken) {
            removeUser();
        } else if (userData.userId && userData.authToken) {
            const result = await usersApi.withToken(userData.authToken).get(userData.userId);
            if (result.statusCode && result.statusCode === StatusCodes.UNAUTHORIZED) {
                handleAlert(true, AlertType.DANGER, "Session Expired", "User Session has expired, please login again!");
                removeUser();
            }
        }
    }

    useEffect(() => {
        const storage = JSON.parse(localStorage.getItem("userData"));
        if (storage) {
            addUser(storage);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
        if (!userData.userId || !userData.authToken) {
            setTimeout(() => {
                handleAlert(false);
                if (history) history.replace("/");
            }, ALERT_TIMEOUT * 2);
        }
    }, [userData]);

    const context: AppCtx = {
        userData: userData,
        error: error,
        alert: alert,
        isLoggedIn: isLoggedIn,
        addUser: addUser,
        removeUser: removeUser,
        showErrorAlert: showErrorAlert,
        hideErrorAlert: hideErrorAlert,
        handleAlert: handleAlert,
        checkValidLogin: checkValidLogin
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}