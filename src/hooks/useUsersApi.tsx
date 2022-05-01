import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersApi } from "../api/UsersAPI";
import { User } from "../domain/User";
import { RootState } from "../store";
import { authActions } from "../store/authSlice";
import { AlertType, uiActions } from "../store/uiSlice";

const useUsersApi = (listAutoLoad: boolean = true) => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);

    const list = useCallback(async () => {
        const result = await usersApi.withToken(loggedUser.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            setUsers([]);
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        } else {
            setUsers(result.data);
        }
    }, [loggedUser.authToken, dispatch])

    const findUser = (nameOrEmail: string): User => {
        return users.find(u => u.name === nameOrEmail || u.email === nameOrEmail)
    }

    const get = useCallback(async (id: string) => {
        const result = await usersApi.withToken(loggedUser.authToken).get(id);
        if (result.statusCode !== StatusCodes.OK) {
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        } else {
            return result.data;
        }
    },[dispatch, loggedUser.authToken])


    const create = useCallback(async (user: User) => {
        const result = await usersApi.withToken(loggedUser.authToken).create(user);
        if (result.statusCode !== StatusCodes.CREATED) {
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        }
    },[dispatch, loggedUser.authToken])

    const update = useCallback(async (id:string, user: User) => {
        const result = await usersApi.withToken(loggedUser.authToken).update(id, user);
        if (result.statusCode !== StatusCodes.OK) {
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        }
    },[dispatch, loggedUser.authToken])


    const remove = useCallback(
        async (user: User) => {
            try {
                const result = await usersApi.withToken(loggedUser.authToken).delete(user._id);
                if (result && result.statusCode !== StatusCodes.OK) {
                    console.error(result.name, result.description);
                    return () =>
                        dispatch(
                            uiActions.handleAlert({
                                show: true,
                                type: AlertType.DANGER,
                                title: result.name,
                                message: JSON.stringify(result.description),
                            })
                        );
                } else {
                    await list();
                    return () =>
                        dispatch(
                            uiActions.handleAlert({
                                show: true,
                                type: AlertType.WARNING,
                                title: "Delete Product",
                                message: `Product '${user.name}' deleted successfully`
                            })
                        );
                }
            } catch (error) {
                console.error(error);
            }
        },
        [loggedUser.authToken, dispatch, list]
    );

    const login = useCallback(async (email: string, password: string) => {
        const result = await usersApi.login(email, password);
        if (result.statusCode !== StatusCodes.OK) {
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        } else {
            const user = {
                userId: result.data._id,
                name: result.data.name,
                userEmail: result.data.email,
                authToken: result.data.authToken,
                role: result.data.role
            };
            dispatch(authActions.login(user));
        }
    },[dispatch])

    const changePassword = useCallback(async (email: string, password: string, newPassword: string) => {
        const result = await usersApi.withToken(loggedUser.authToken).updatePassword(email, password, newPassword);
        if (result.statusCode !== StatusCodes.OK) {
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));

        } else {
            await list();
            return () => dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.SUCCESS,
                title: "Change Password",
                message: "The password has been successfully changed"
            }));
        }
    },[dispatch, loggedUser.authToken, list])

    useEffect(() => {
        if (listAutoLoad) list().then(undefined)
    }, [list, listAutoLoad]);

    return {
        users,
        list,
        findUser,
        get,
        update,
        create,
        login,
        remove,
        changePassword,
    };
}

export default useUsersApi;