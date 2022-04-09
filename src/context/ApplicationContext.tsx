import {createContext, useEffect, useState} from "react";

export interface GlobalError {
    show: boolean,
    title: string,
    message: string
}

export interface UserData {
    userId: string,
    userEmail: string,
    role: string,
    authToken: string
}

export interface AppCtx {
    userData: UserData,
    error: GlobalError,
    addUser: Function,
    removeUser: Function,
    isLoggedIn: Function,
    showErrorAlert: Function,
    hideErrorAlert: Function
}

const defaultValue: AppCtx = {
    userData: {
        userId: "",
        userEmail: "",
        role: "",
        authToken: ""
    },
    error: {
        show: false,
        title: "",
        message: ""
    },
    addUser: () => {},
    removeUser: () => {},
    isLoggedIn: () => {},
    showErrorAlert: () => {},
    hideErrorAlert: () => {}
}
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
        role: "DUMMY",
        authToken: ""
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
            userId: user._id,
            userEmail: user.userEmail,
            role: user.role,
            authToken: user.authToken
        })
    }

    const removeUser = () => {
        setUserData({
            userId: "",
            userEmail: "",
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

    const context: AppCtx = {
        userData: userData,
        error: error,
        isLoggedIn: isLoggedIn,
        addUser: addUser,
        removeUser: removeUser,
        showErrorAlert: showErrorAlert,
        hideErrorAlert: hideErrorAlert
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}