import {createContext, useEffect, useState} from "react";

export const ApplicationContext = createContext({
    userData: {},
    error: {},
    addUser: () => {},
    removeUser: () => {},
    isLoggedIn: () => {},
    showErrorAlert: () => {},
    hideErrorAlert: () => {}
});

export const ApplicationContextProvider = (props) => {
    const [error, setError] = useState({
        show: false,
        title: "",
        message: ""
    });
    const [userData, setUserData] = useState({
        userId: "",
        userEmail: "",
        role: "",
        authToken: ""
    });

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData) {
            setUserData(userData)
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

    const context = {
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