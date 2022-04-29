import {useCallback, useContext, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../context/ApplicationContext";
import {User} from "../domain/User";
import {useSelector} from "react-redux";
import {RootState} from "../store";

const useUsers = () => {
    const appCtx = useContext(ApplicationContext);
    const [users, setUsers] = useState<User[]>([]);
    const { handleAlert } = appCtx;
    const user = useSelector<RootState, User>(state => state.auth.user);

    const loadUsers = useCallback(async () => {
        const result = await usersApi.withToken(user.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            setUsers([]);
        } else {
            setUsers(result.data);
        }
    },[user.authToken, handleAlert])

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