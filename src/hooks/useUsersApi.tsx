import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersApi } from "../api/UsersAPI";
import { User } from "../domain/User";
import { RootState } from "../store";
import { AlertType, uiActions } from "../store/uiSlice";

const useUsersApi = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const user = useSelector<RootState, User>(state => state.auth.user);

    const list = useCallback(async () => {
        const result = await usersApi.withToken(user.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
            setUsers([]);
        } else {
            setUsers(result.data);
        }
    }, [user.authToken, dispatch])

    const findUser = (nameOrEmail: string): User => {
        return users.find(u => u.name === nameOrEmail || u.email === nameOrEmail)
    }

    useEffect(() => {
        list().then(undefined)
    }, [list]);

    return {
        users,
        findUser,
    };
}

export default useUsersApi;