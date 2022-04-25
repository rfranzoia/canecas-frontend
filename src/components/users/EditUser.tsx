import {usersApi} from "../../api/UsersAPI";
import {EditUserForm} from "./EditUserForm";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
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

    const handleSaveUser = (user) => {
        if (props.op === "view") return;
        const save = async (user) => {
            let result;
            if (props.op === "edit") {
                result = await usersApi.withToken(appCtx.userData.authToken).update(props.id, user);
            } else if (props.op === "new") {
                result = await usersApi.withToken(appCtx.userData.authToken).create(user);
            }
            if (result.statusCode !== StatusCodes.OK && result.statusCode !== StatusCodes.CREATED) {
                handleCloseModal(result.data)
            } else {
                handleCloseModal();
            }
        };
        save(user).then(undefined);
    };

    const handleCloseModal = (error?) => {
        props.onCloseModal(error);
    };

    useEffect(() => {
        const getUser = async () => {
            if (props.op === "edit" || props.op === "view") {
                const result = await usersApi.withToken(appCtx.userData.authToken).get(props.id);
                if (result.statusCode !== StatusCodes.OK) {
                    appCtx.showErrorAlert(result.name, result.description);
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
        };
        getUser().then(undefined);
    }, [props.id, props.op, appCtx]);

    return (
        <>
            <EditUserForm user={user} op={props.op} onSaveUser={handleSaveUser} onCancel={handleCloseModal} />
        </>
    );
};
