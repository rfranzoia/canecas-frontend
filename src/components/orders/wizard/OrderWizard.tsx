import { useState } from "react";
import { ShowType } from "../../users/UserRegistration";
import { WizardFormData } from "../Orders";
import { OrderWizardAmount } from "./OrderWizardAmount";
import { OrderWizardBackground } from "./OrderWizardBackground";
import { OrderWizardCaricatures } from "./OrderWizardCaricatures";
import { OrderWizardUserLogin } from "./OrderWizardUserLogin";
import { OrderWizardUserRegister } from "./OrderWizardUserRegister";
import { OrderWizardProduct } from "./OrderWizardProduct";

const initWizardFormData: WizardFormData = {
    user: null,
    _id: "",
    product: "",
    price: 0,
    caricature: 0,
    caricatureImages: "",
    caricatureImagesFile: null,
    background: "empty",
    backgroundDescription: "",
    backgroundImage: "",
    backgroundImageFile: null,
    amount: 0,
}

export const OrderWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [currUserFormType, setCurrUserFormType] = useState(ShowType.SIGN_UP);
    const [wizardFormData, setWizardFormData] = useState(initWizardFormData)

    const handleFinishWizard = (formData: WizardFormData) => {
        const _id = wizardFormData.product.trim().concat(wizardFormData.caricature.toString()).concat(wizardFormData.background);
        const data = {
            ...wizardFormData,
            _id: _id,
            price: formData.price,
            amount: formData.amount,
        }
        props.onFinishWizard(data);
    }

    const handleCancel = () => {
        props.onCancel();
    }

    const updateFormData = (formData: WizardFormData) => {
        if (formData.user) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    user: formData.user,
                }
            })
        }
        if (formData.product) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    product: formData.product,
                    price: formData.price,
                }
            })
        }
        if (formData.caricature) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    caricature: formData.caricature,
                    caricatureImages: formData.caricatureImages,
                    caricatureImagesFile: formData.caricatureImagesFile,
                }
            })
        }
        if (formData.background) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    background: formData.background,
                    backgroundImage: formData.backgroundImage,
                    backgroundDescription: formData.backgroundDescription,
                    backgroundImageFile: formData.backgroundImageFile,
                }
            })
        }
    }

    const handleChangeUserForm = (showType: ShowType) => {
        setCurrUserFormType(showType);
    }

    const handleForward = (formData: WizardFormData) => {
        if (currStep === (steps.length - 1)) return;
        const next = currStep + 1;
        updateFormData(formData);
        setCurrStep(next);
    }

    const handleBackward = () => {
        if (currStep === 0) return;
        const previous = currStep - 1;
        setCurrStep(previous);
    }

    const userFormType = [
        <OrderWizardUserLogin onForward={handleForward} onCancel={handleCancel} wizardData={wizardFormData} onChangeUserForm={handleChangeUserForm}/>,
        <OrderWizardUserRegister onForward={handleForward} onCancel={handleCancel} wizardData={wizardFormData} onChangeUserForm={handleChangeUserForm}/>,
    ]

    const steps = [
        [userFormType[currUserFormType], "30rem"],
        [<OrderWizardProduct onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>, "30rem"],
        [<OrderWizardCaricatures onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>, "40rem"],
        [<OrderWizardBackground onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>, "45rem"],
        [<OrderWizardAmount onCancel={handleCancel} onBackward={handleBackward} onFinishWizard={handleFinishWizard} wizardData={wizardFormData}/>, "40rem"],
    ]

    return (
        <div style={{ width: `${steps[currStep][1]}` }}>
            {steps[currStep][0]}
        </div>
    );
}
