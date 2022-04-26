import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {AlertType, ApplicationContext} from "./ApplicationContext";
import {StatusCodes} from "http-status-codes";
import {User} from "../domain/User";

export interface OrdersCtx {
    users: User[],
    loadUsers: Function,
}

const defaultValue: OrdersCtx = {
    users: [],
    loadUsers: () => {},
}

export const OrdersContext = createContext(defaultValue);

export const OrdersContextProvider = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState([]);
    const { handleAlert } = appCtx;

    const loadUsers = useCallback(async () => {
        const result = await usersApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            setUsers([]);
        } else {
            setUsers(result.data);
        }
    },[appCtx.userData.authToken, handleAlert])

    useEffect(() => {
        loadUsers().then(undefined)
    }, [loadUsers]);

    const context: OrdersCtx = {
        users: users,
        loadUsers: loadUsers,
    }

    return (
        <OrdersContext.Provider value={context}>
            {props.children}
        </OrdersContext.Provider>
    );
}
