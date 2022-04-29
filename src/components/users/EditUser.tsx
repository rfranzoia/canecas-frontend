import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersApi } from "../../api/UsersAPI";
import { User } from "../../domain/User";
import { RootState } from "../../store";
import { AlertType, uiActions } from "../../store/uiSlice";
import { EditUserForm } from "./EditUserForm";

export const EditUser = (props) => {
    const loggedUser = useSelector<RootState, User>(state => state.auth.user);
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const { op, id } = props;

    const handleSaveUser = (user) => {
        if (op === "view") return;
        const save = async (user) => {
            let result;
            if (op === "edit") {
                result = await usersApi.withToken(loggedUser.authToken).update(id, user);
            } else if (op === "new") {
                result = await usersApi.withToken(loggedUser.authToken).create(user);
            }
            if (result.statusCode !== StatusCodes.OK && result.statusCode !== StatusCodes.CREATED) {
                handleCloseModal(result)
            } else {
                handleCloseModal();
            }
        };
        save(user).then(undefined);
    };

    const handleCloseModal = (error?) => {
        props.onCloseModal(error);
    };

    const getUser = useCallback(async () => {
        if (op === "edit" || op === "view") {
            const result = await usersApi.withToken(loggedUser.authToken).get(id);
            if (result.statusCode !== StatusCodes.OK) {
                dispatch(uiActions.handleAlert({
                    show: true,
                    type: AlertType.DANGER,
                    title: result.name,
                    message: result.description
                }));
            } else {
                setUser(result.data);
            }
        } else {
            setUser({
                role: "",
                name: "",
                email: "",
                password: "",
                phone: "",
                address: "",
            });
        }
    }, [id, op, loggedUser.authToken, dispatch])

    useEffect(() => {
        getUser().then(undefined);
    }, [getUser]);

    return (
        <>
            <EditUserForm user={user} op={op} onSaveUser={handleSaveUser} onCancel={handleCloseModal}/>
        </>
    );
};