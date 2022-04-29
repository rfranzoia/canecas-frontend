import {createContext, useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";
import {ALERT_TIMEOUT} from "../store/uiSlice";

export interface UserData {
    _id: string,
    name: string,
    email: string,
    role: string,
    authToken: string
}

export interface AppCtx {
    userData: UserData,
    isLoggedIn: Function,
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
    isLoggedIn: () => {},
    getToken: () => {},
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

    const isLoggedIn = () => {
        return (userData.email !== "" && userData.authToken !== "");
    }

    const getToken = useCallback(() => {
        return userData.authToken;
    }, [userData.authToken]);

    const isTokenValid = useCallback(async (token) => {
        const res = await usersApi.validateToken(token);
        return res.statusCode === StatusCodes.OK;
    }, [])

    useEffect(() => {
        localStorage.setItem("userData", JSON.stringify(userData));
        if (!userData._id || !userData.authToken) {
            let t = setTimeout(() => {
                clearTimeout(t);
                if (history) history.replace("/");
            }, ALERT_TIMEOUT * 2);
        } else {
            isTokenValid(userData.authToken)
                .then(isValid => {
                    if (!isValid) {
                        let t = setTimeout(() => {
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
    }, [userData, history, isTokenValid]);

    const context: AppCtx = {
        userData: userData,
        isLoggedIn: isLoggedIn,
        getToken: getToken,
    }

    return (
        <ApplicationContext.Provider value={context}>
            {props.children}
        </ApplicationContext.Provider>
    );
}

