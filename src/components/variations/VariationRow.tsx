import {Image} from "react-bootstrap";
import classes from "./variation.module.css"
import {imageHelper} from "../ui/ImageHelper";
import {useEffect, useState} from "react";
import {ActionIconType, getActionIcon} from "../ui/ActionIcon";

export const VariationRow = (props) => {
    const [image, setImage] = useState(null);
    const [variation, setVariation] = useState({
        _id: "625d34f81fc4fc33b40c9c02",
        product: "Camisa com arte",
        drawings: 0,
        background: "empty",
        price: 59.9,
        image: "camisa-arte.jpg",
    })

    const loadImage = async (name) => {
        setImage(await imageHelper.getImageFromServer(name));
    }

    useEffect(() => {
        setVariation({
            _id: props.variation._id,
            product: props.variation.product,
            drawings: props.variation.drawings,
            background: props.variation.background,
            price: props.variation.price,
            image: props.variation.image,
        });
        loadImage(props.variation.image);
    }, []);

    const handleOnClickRow = (variationId: string) => {
        console.log("selected", variationId);
    }
    return (
        <>
            <tr style={{ verticalAlign: "center", margin: "0"}} className="align-middle">
                <td width="5%" align="center">
                    <Image className={classes.imageTest} src={image} fluid width="50" title={variation.product}/>
                </td>
                <td width="35%" >{variation.product}</td>
                <td width="25%" align="center">{variation.drawings}</td>
                <td width="25%" align="center">{variation.background}</td>
                <td width="10%" align="right">{variation.price.toFixed(2)}</td>
                <td width="10%" align="right">
                    {getActionIcon(ActionIconType.EXPAND, {
                        color: "#000",
                        title: "select",
                        canClick: true,
                        onClick: () => handleOnClickRow(variation._id)
                    })}
                </td>
            </tr>
        </>
    );
}




