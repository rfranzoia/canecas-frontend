import {useState} from "react";
import {WizardFormData} from "../Orders";
import {OrderItemWizardProduct} from "./OrderItemWizardProduct";
import {OrderItemWizardDrawings} from "./OrderItemWizardDrawings";
import {OrderItemWizardBackground} from "./OrderItemWizardBackground";
import {OrderItemWizardAmount} from "./OrderItemWizardAmount";

import "./orderItemWizard.css";

export const OrderItemWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [wizardFormData, setWizardFormData] = useState({
        product: "",
        productPrice: 0,
        drawings: 0,
        drawingsImage: "",
        drawingsImageFile: null,
        background: "empty",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
        amount: 0,
    })

    const addItem = () => {
        console.log(wizardFormData);
        props.onCancel();
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

    const handleVariantSelected = (selectedVariant: WizardFormData) => {
        updateFormData(selectedVariant);
        setCurrStep(steps.length - 1);
    }

    const handleFinish = (formData: WizardFormData) => {
        setWizardFormData(prevState => {
            return {
                ...prevState,
                amount: formData.amount,
            }
        })
        addItem();
    }

    const steps = [
        <OrderItemWizardProduct onForward={handleForward} onCancel={handleCancel} onVariantSelected={handleVariantSelected} orderItem={wizardFormData} />,
        <OrderItemWizardDrawings onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} orderItem={wizardFormData} />,
        <OrderItemWizardBackground onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward} orderItem={wizardFormData} />,
        <OrderItemWizardAmount onFinish={handleFinish} onCancel={handleCancel} orderItem={wizardFormData} onBackward={handleBackward} />,
    ]

    return (
        <div style={{ width: "35rem"}}>
            {steps[currStep]}
        </div>
    );
}