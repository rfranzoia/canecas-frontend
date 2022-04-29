import { Carousel, Image } from "react-bootstrap";
import { ActionIconType, getActionIcon } from "../ui/ActionIcon";
import { imageHelper } from "../ui/ImageHelper";

export const HowToOrderPresentation = () => {

    const howToOrderImages = [
        { id: 1, name: "como-pedir-1.png", title: "Step 1" },
        { id: 2, name: "como-pedir-2.png", title: "Step 2" },
        { id: 3, name: "como-pedir-3.png", title: "Step 3" },
        { id: 4, name: "como-pedir-4.png", title: "Step 4" },
        { id: 5, name: "como-pedir-5.png", title: "Step 5" },
    ];

    const howToOrderCarousel = (
        <Carousel variant="dark"
                  pause="hover"
                  nextIcon={getActionIcon(ActionIconType.ACTION_FORWARD,
                      {
                          canClick: true,
                          color: "#000",
                          title: "Next Step"
                      })}
                  prevIcon={getActionIcon(ActionIconType.ACTION_BACKWARD,
                      {
                          canClick: true,
                          color: "#000",
                          title: "Previous Step"
                      })}>
            {howToOrderImages.map(i => {
                return (
                    <Carousel.Item key={i.id}>
                        <Image src={imageHelper.getImageFromClient(i.name)}
                               fluid
                               width="715"
                               title={i.title}/>
                    </Carousel.Item>
                )
            })
            }
        </Carousel>
    )


    return (
        <div className="flex-centered-container black-shadow" style={{ width: "47rem" }}>
            <div>
                <h2 style={{ textAlign: "center" }}>How To Order</h2>
                <div className="two-items-container">
                    {howToOrderCarousel}
                </div>
                <div style={{ textAlign: "center" }}>
                    <small>Press ESC to close this window</small>
                </div>
            </div>
        </div>
    );
}