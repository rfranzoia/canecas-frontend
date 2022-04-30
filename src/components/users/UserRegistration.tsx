import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { UserSignInForm } from "./UserSignInForm";
import { UserSignUpForm } from "./UserSignUpForm";

export const enum ShowType { SIGN_IN, SIGN_UP}

export const UserRegistration = (props) => {
    const [showType, setShowType] = useState(ShowType.SIGN_IN);

    const handleShowType = (showType: ShowType) => {
        setShowType(showType);
    }

    useEffect(() => {
        setShowType(props.showType);
    }, [props.showType]);

    if (props.show) {
        return (
            <Modal
                onClose={props.handleClose}>
                <div>
                    {showType === ShowType.SIGN_IN && <UserSignInForm onClose={props.handleClose} onShowType={handleShowType}/>}
                    {showType === ShowType.SIGN_UP && <UserSignUpForm onClose={props.handleClose} onShowType={handleShowType}/>}
                </div>
            </Modal>
        )
    }

    return null;
}