import {createContext, useEffect, useState} from "react";

export const ApplicationContext = createContext({
    userData: {},
    favorites: [],
    count: 0,
    addUser: () => {},
    removeUser: () => {},
    isLoggedIn: () => {}
});

export const ApplicationContextProvider = (props) => {
    const [userData, setUserData] = useState({
        userId: "",
        userEmail: "",
        authToken: ""
    })

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
            authToken: user.authToken
        })
    }
    const removeUser = () => {
        setUserData({
            userId: "",
            userEmail: "",
            authToken: ""
        });
    }
    const isLoggedIn = () => {
        return (userData.userEmail !== "" && userData.authToken !== "");
    }

    const context = {
        userData: userData,
        isLoggedIn: isLoggedIn,
        addUser: addUser,
        removeUser: removeUser
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}