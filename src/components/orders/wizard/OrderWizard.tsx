import { useState } from "react";
import { WizardFormData } from "../Orders";
import { OrderWizardAmount } from "./OrderWizardAmount";
import { OrderWizardBackground } from "./OrderWizardBackground";
import { OrderWizardDrawingsForm } from "./OrderWizardDrawingsForm";
import { OrderWizardPersonalInfoForm } from "./OrderWizardPersonalInfoForm";
import { OrderWizardProductForm } from "./OrderWizardProductForm";

const initWizardFormData: WizardFormData = {
    user: null,
    product: "",
    price: 0,
    drawings: 0,
    drawingsImages: "",
    drawingsImagesFile: null,
    background: "",
    backgroundDescription: "",
    backgroundImage: "",
    backgroundImageFile: null,
    amount: 0,
}

export const OrderWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [wizardFormData, setWizardFormData] = useState(initWizardFormData)

    const save = () => {
        console.log(wizardFormData);
        props.onCancel();
    }
    const handleCancel = () => {
        props.onCancel();
    }

    const handleForward = (formData: WizardFormData) => {
        if (currStep === (steps.length - 1)) return;
        const next = currStep + 1;
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
        if (formData.drawings) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    drawings: formData.drawings,
                    drawingsImages: formData.drawingsImages,
                    drawingsImagesFile: formData.drawingsImagesFile,
                }
            })
        }
        if (formData.background) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    background: formData.background,
                    backgroundImage: formData.backgroundImage,
                    backgroundImageFile: formData.backgroundImageFile,
                }
            })
        }
        setCurrStep(next);
    }

    const handleBackward = () => {
        if (currStep === 0) return;
        const previous = currStep - 1;
        setCurrStep(previous);
    }

    const handleFinishWizard = (formData: WizardFormData) => {
        setWizardFormData(prevState => {
            return {
                ...prevState,
                amount: formData.amount,
            }
        })
        save();
    }

    const steps = [
        <OrderWizardPersonalInfoForm onForward={handleForward} onCancel={handleCancel}/>,
        <OrderWizardProductForm onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward}/>,
        <OrderWizardDrawingsForm onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward}/>,
        <OrderWizardBackground onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward}/>,
        <OrderWizardAmount onCancel={handleCancel} onBackward={handleBackward} onFinish={handleFinishWizard}/>,
    ]

    return (
        <>
            {steps[currStep]}
        </>
    );
}
