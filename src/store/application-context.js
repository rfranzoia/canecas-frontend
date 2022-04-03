import {createContext, useEffect, useState} from "react";

export const ApplicationContext = createContext({
    userData: {},
    favorites: [],
    count: 0,
    addFavorite: (meetup) => {},
    removeFavorite: (id) => {},
    isFavorite: (id) => {},
    addUser: (user) => {},
    removeUser: () => {},
    isLoggedIn: () => {}
});

export const ApplicationContextProvider = (props) => {
    const [userFavorites, setUserFavorites] = useState([]);
    const [userData, setUserData] = useState({
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

    const addFavorite = (meetup) => {
        setUserFavorites(prevState => {
            return [
                ...prevState,
                meetup
            ]
        });
    }

    const removeFavorite = (id) => {
        setUserFavorites(prevState => {
            return prevState.filter(meetup => meetup.id !== id);
        })
    }

    const isFavorite = (id) => {
        return userFavorites.some(meetup => meetup.id === id)
    }

    const addUser = (user) => {
        setUserData({
            userEmail: user.userEmail,
            authToken: user.authToken
        })
    }
    const removeUser = () => {
        setUserData({
            userEmail: "",
            authToken: ""
        });
    }
    const isLoggedIn = () => {
        return (userData.userEmail !== "" && userData.authToken !== "");
    }

    const context = {
        userData: userData,
        favorites: userFavorites,
        count: userFavorites.length,
        addFavorite: addFavorite,
        removeFavorite: removeFavorite,
        isFavorite: isFavorite,
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