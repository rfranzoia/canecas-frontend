import {useCallback, useEffect, useState} from "react";
import {usersApi} from "../api/UsersAPI";
import {StatusCodes} from "http-status-codes";
import {User} from "../domain/User";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store";
import {AlertType, uiActions} from "../store/uiSlice";

const useUsers = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState<User[]>([]);
    const user = useSelector<RootState, User>(state => state.auth.user);

    const loadUsers = useCallback(async () => {
        const result = await usersApi.withToken(user.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            dispatch(uiActions.handleAlert({show:true, type:AlertType.DANGER, title:result.name, message:result.description}));
            setUsers([]);
        } else {
            setUsers(result.data);
        }
    },[user.authToken, dispatch])

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