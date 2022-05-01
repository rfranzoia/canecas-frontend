import { useCallback, useEffect, useState } from "react";
import useUsersApi from "../../hooks/useUsersApi";
import { OpType } from "../../store";
import { AlertToast } from "../ui/AlertToast";
import { EditUserForm } from "./EditUserForm";

export const EditUser = (props) => {
    const { get, update, create } = useUsersApi();
    const [showAlert, setShowAlert] = useState(false);
    const [user, setUser] = useState({
        role: "",
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });
    const { op, id } = props;

    const handleSaveUser = async (user) => {
        if (op === OpType.VIEW) return;

        let error;
        if (op === OpType.EDIT) {
            error = await update(id, user);
        } else if (op === OpType.NEW) {
            error = await create(user);
        }
        if (error) {
            error();
            setShowAlert(true);
        } else {
            props.onCloseModal(true);
        }

    };

    const getUser = useCallback(async () => {
        if (op === OpType.EDIT || op === OpType.VIEW) {
            const result = await get(id);
            if (result._id) {
                setUser(result);
            } else {
                setShowAlert(true);
                result();
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
    }, [id, op, get])

    useEffect(() => {
        getUser().then(undefined);
    }, [getUser]);

    return (
        <>
            {showAlert && <AlertToast showAlert={showAlert} />}
            <EditUserForm user={user} op={op} onSaveUser={handleSaveUser} onCancel={props.onCloseModal}/>
        </>
    );
};