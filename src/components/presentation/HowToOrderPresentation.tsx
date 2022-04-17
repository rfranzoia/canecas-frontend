import {Card, Fade, Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";
import {useState} from "react";

export const HowToOrderPresentation = (props) => {
    const [howToOrderIndex, setHowToOrderIndex] = useState(0);
    const [fade, setFade] = useState(true);

    const howToOrderImages = [
        { id: 1, name: "como-pedir-1.png", title: "Step 1"},
        { id: 2, name: "como-pedir-2.png", title: "Step 2"},
        { id: 3, name: "como-pedir-3.png", title: "Step 3"},
        { id: 4, name: "como-pedir-4.png", title: "Step 4"},
        { id: 5, name: "como-pedir-5.png", title: "Step 5"},
    ];


    const handleHowToOrder = (count: number) => {
        setFade(false);
        setHowToOrderIndex(prevState => {
            let next = prevState + count;
            if (next > (howToOrderImages.length - 1)) {
                next -= count;
            } else if (next < 0) {
                next = 0;
            }
            return next;
        });
        setTimeout(() => {
            setFade(true);
        }, 300);
    }

    return (
        <div className="flex-centered-container black-shadow" style={{ width: "47rem"}}>
            <div>
                <h2 style={{textAlign: "center"}}>Como fazer seu pedido</h2>
                    <h4 style={{textAlign: "center"}}>{howToOrderImages[howToOrderIndex].title}</h4>
                    <div className="two-items-container">
                        <div>
                            {getActionIcon(ActionIconType.ACTION_BACKWARD,
                                {
                                    title: "Previous",
                                    color: "green",
                                    canClick: true,
                                    onClick: () => handleHowToOrder(-1)
                                })
                            }
                        </div>
                        <Fade in={fade}>
                            <Image src={imageHelper.getImageFromClient(howToOrderImages[howToOrderIndex].name)}
                                   fluid width="600" title={howToOrderImages[howToOrderIndex].title}/>
                        </Fade>
                        <div>
                            {getActionIcon(ActionIconType.ACTION_FORWARD,
                                {
                                    title: "Next",
                                    color: "green",
                                    canClick: true,
                                    onClick: () => handleHowToOrder(1)
                                })
                            }
                        </div>
                    </div>
                    <div style={{ textAlign: "center"}}>
                        <small>Press ESC to close this window</small>
                    </div>
            </div>
        </div>
    );
}