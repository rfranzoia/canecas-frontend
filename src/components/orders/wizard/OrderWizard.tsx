import {OrderWizardPersonalInfoForm} from "./OrderWizardPersonalInfoForm";
import {useState} from "react";
import {OrderWizardProductForm} from "./OrderWizardProductForm";
import {OrderWizardDrawingsForm} from "./OrderWizardDrawingsForm";
import {OrderWizardBackground} from "./OrderWizardBackground";
import {OrderWizardAmount} from "./OrderWizardAmount";
import {WizardFormData} from "../Orders";



export const OrderWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [wizardFormData, setWizardFormData] = useState({
        user: null,
        product: "",
        productPrice: 0,
        drawings: 0,
        drawingsImage: "",
        drawingsImageFile: null,
        background: "",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
        amount: 0,
    })

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
                    productPrice: formData.productPrice,
                }
            })
        }
        if (formData.drawings) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    drawings: formData.drawings,
                    drawingsImage: formData.drawingsImage,
                    drawingsImageFile: formData.drawingsImageFile,
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
        <OrderWizardPersonalInfoForm onForward={handleForward} onCancel={handleCancel} />,
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
