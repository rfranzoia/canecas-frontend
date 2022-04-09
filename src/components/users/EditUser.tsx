import { usersApi } from "../../api/UsersAPI";
import { EditUserForm } from "./EditUserForm";
import { useContext, useEffect, useState } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import { StatusCodes } from "http-status-codes";

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
        const save = async (user) => {
            let result;
            if (props.op === "edit") {
                result = await usersApi.withToken(appCtx.userData.authToken).update(props.id, user);
            } else if (props.op === "new") {
                result = await usersApi.withToken(appCtx.userData.authToken).create(user);
            }
            if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
                appCtx.showErrorAlert(result.name, result.description);
            } else if (result?.statusCode === StatusCodes.BAD_REQUEST) {
                handleCancel(result);
            }
            handleCancel();
        };
        save(user).then(() => undefined);
    };

    const handleCancel = (error?) => {
        props.onSaveCancel(error);
    };

    useEffect(() => {
        const callback = async () => {
            if (props.op === "edit" || props.op === "view") {
                const result = await usersApi.withToken(appCtx.userData.authToken).get(props.id);
                if (result?.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                }
                setUser(result);
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
        callback().then(() => {
            return undefined;
        });
    }, [props.id, props.op, appCtx]);

    const handleOp = (user) => {
        if (props.op !== "view") {
            handleSaveUser(user);
        }
    };

    return (
        <>
            <EditUserForm user={user} op={props.op} onSaveUser={handleOp} onCancel={handleCancel} />
        </>
    );
};
