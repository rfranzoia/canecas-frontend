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

    useEffect(() => {
        setProduct(props.product.product);
    }, [props.product]);

    return (
        <div className="flex-container">
            <div className="flex-item-image">
                <Image src={imageHelper.getImageUrl(product.image)}
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