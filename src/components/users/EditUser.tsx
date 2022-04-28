import {usersApi} from "../../api/UsersAPI";
import {EditUserForm} from "./EditUserForm";
import {useCallback, useContext, useEffect, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";

export const EditUser = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [user, setUser] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const {handleAlert, getToken} = appCtx;
    const {op, id} = props;

    const handleSaveUser = (user) => {
        if (op === "view") return;
        const save = async (user) => {
            let result;
            if (op === "edit") {
                result = await usersApi.withToken(getToken()).update(id, user);
            } else if (op === "new") {
                result = await usersApi.withToken(getToken()).create(user);
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
            const result = await usersApi.withToken(getToken()).get(id);
            if (result.statusCode !== StatusCodes.OK) {
                handleAlert(true, AlertType.DANGER, result.name, result.description);
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
    }, [id, op, getToken, handleAlert])

    useEffect(() => {
        getUser().then(undefined);
    }, [getUser]);

    return (
        <>
            <EditUserForm user={user} op={op} onSaveUser={handleSaveUser} onCancel={handleCloseModal} />
        </>
    );
};