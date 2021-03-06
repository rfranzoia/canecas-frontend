import { useState } from "react";
import { WizardFormData } from "../Orders";
import { OrderItemWizardAmount } from "./OrderItemWizardAmount";
import { OrderItemWizardBackground } from "./OrderItemWizardBackground";
import { OrderItemWizardCaricatures } from "./OrderItemWizardCaricatures";
import { OrderItemWizardProduct } from "./OrderItemWizardProduct";

export const OrderItemWizard = (props) => {
    const [currStep, setCurrStep] = useState(0);
    const [wizardFormData, setWizardFormData] = useState({
        _id: "",
        product: "",
        price: 0,
        caricatures: 0,
        caricatureImages: "",
        caricatureImagesFile: null,
        background: "empty",
        backgroundDescription: "",
        backgroundImage: "",
        backgroundImageFile: null,
        amount: 0,
    })

    const handleFinish = (formData: WizardFormData) => {
        const _id = wizardFormData.product.trim().concat(wizardFormData.caricatures.toString()).concat(wizardFormData.background);
        const data = {
            ...wizardFormData,
            _id: _id,
            price: formData.price,
            amount: formData.amount,
        }
        props.onItemAdd(data);
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
        if (formData.caricatures) {
            setWizardFormData(prevState => {
                return {
                    ...prevState,
                    caricatures: formData.caricatures,
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

    const handleSelect = (selectedVariant: WizardFormData) => {
        updateFormData(selectedVariant);
        setCurrStep(steps.length - 1);
    }

    const steps = [
        [<OrderItemWizardProduct onForward={handleForward} onCancel={handleCancel} onSelect={handleSelect}
                                orderItem={wizardFormData}/>, "30rem"],
        [<OrderItemWizardCaricatures onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward}
                                 orderItem={wizardFormData}/>, "40rem"],
        [<OrderItemWizardBackground onForward={handleForward} onCancel={handleCancel} onBackward={handleBackward}
                                   orderItem={wizardFormData}/>, "45rem"],
        [<OrderItemWizardAmount onFinish={handleFinish} onCancel={handleCancel} orderItem={wizardFormData}
                               onBackward={handleBackward}/>, "40rem"],
    ]

    return (
        <div style={{ width: `${steps[currStep][1]}` }}>
            {steps[currStep][0]}
        </div>
    );
}
