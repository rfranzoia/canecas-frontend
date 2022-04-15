import {useEffect, useState} from "react";
import {imageHelper} from "../ui/ImageHelper";
import {Image} from "react-bootstrap";

export const ProductShowCaseRow = (props) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        type: "",
        image: ""
    })
    const [image, setImage] = useState(null);

    const getImage = (name) => {
        const load = async () => {
            setImage(await imageHelper.getImageFromServer(name));
        }

        load().then(() => null);
    }

    useEffect(() => {
        setProduct(props.product.product);
        getImage(props.product.product.image)
    }, [props.product]);

    return (
        <div className="flex-container">
            <div className="flex-item-image">
                <Image src={image}
                       fluid width="250" title={product.name}/>
            </div>
            <div className="flex-item-data">
                <h3>{product.type}</h3>
                <h4>{product.name}</h4>
                <p>{product.description}</p>
                <p>à partir de R$ {props.product.price.toFixed(2)}</p>
            </div>
        </div>
    );
}