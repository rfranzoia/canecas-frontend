import { useState } from "react";
import { WizardFormData } from "../Orders";
import { OrderWizardAmount } from "./OrderWizardAmount";
import { OrderWizardBackground } from "./OrderWizardBackground";
import { OrderWizardDrawingsForm } from "./OrderWizardDrawingsForm";
import { OrderWizardPersonalInfoForm } from "./OrderWizardPersonalInfoForm";
import { OrderWizardProductForm } from "./OrderWizardProductForm";

const initWizardFormData: WizardFormData = {
    user: null,
    _id: "",
    product: "",
    price: 0,
    drawings: 0,
    drawingsImages: "",
    drawingsImagesFile: null,
    background: "empty",
    backgroundDescription: "",
    backgroundImage: "",
    backgroundImageFile: null,
    amount: 0,
}

export const OrderWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [wizardFormData, setWizardFormData] = useState(initWizardFormData)

    const handleFinishWizard = (formData: WizardFormData) => {
        const _id = wizardFormData.product.trim().concat(wizardFormData.drawings.toString()).concat(wizardFormData.background);
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
                    backgroundDescription: formData.backgroundDescription,
                    backgroundImageFile: formData.backgroundImageFile,
                }
            })
        }
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

    const steps = [
        <OrderWizardPersonalInfoForm onForward={handleForward} onCancel={handleCancel} wizardData={wizardFormData}/>,
        <OrderWizardProductForm onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>,
        <OrderWizardDrawingsForm onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>,
        <OrderWizardBackground onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} wizardData={wizardFormData}/>,
        <OrderWizardAmount onCancel={handleCancel} onBackward={handleBackward} onFinishWizard={handleFinishWizard} wizardData={wizardFormData}/>,
    ]

    return (
        <div style={{ width: "35rem" }}>
            {steps[currStep]}
        </div>
    );
}
