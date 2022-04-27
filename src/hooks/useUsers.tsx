import {useCallback, useContext, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../context/ApplicationContext";
import {User} from "../domain/User";

const useUsers = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState<User[]>([]);
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

    const findUser = (nameOrEmail: string): User => {
        return users.find(u => u.name === nameOrEmail || u.email === nameOrEmail)
    }

    useEffect(() => {
        loadUsers().then(undefined)
    }, [loadUsers]);

    return {
        users,
        findUser,
    };
}

export default useUsers;