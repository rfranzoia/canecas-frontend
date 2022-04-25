import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {AlertType, ApplicationContext} from "./ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {User} from "../domain/User";

export interface OrdersCtx {
    users: User[],
    getUsers: Function,
    loadUsers: Function,
}

const defaultValue: OrdersCtx = {
    users: [],
    getUsers: () => {},
    loadUsers: () => {},
}

export const OrdersContext = createContext(defaultValue);

export const OrdersContextProvider = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const { handleAlert } = appCtx;

    const getUsers = () => {
        return users;
    }

    const loadUsers = useCallback(async () => {
        const result = await usersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode === StatusCodes.UNAUTHORIZED) {
            handleAlert(true, AlertType.WARNING, result.name, result.description);
            setUsers([]);
        } else {
            setUsers(result);
        }
    },[appCtx.userData.authToken, handleAlert])

    useEffect(() => {
        loadUsers().then(undefined)
    }, [loadUsers]);

    const context: OrdersCtx = {
        users: users,
        getUsers: getUsers,
        loadUsers: loadUsers,
    }

    return (
        <OrdersContext.Provider value={context}>
            {props.children}
        </OrdersContext.Provider>
    );
}
