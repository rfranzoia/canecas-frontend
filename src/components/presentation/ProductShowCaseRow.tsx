import {useEffect, useState} from "react";
import {imageHelper} from "../ui/ImageHelper";
import {Image} from "react-bootstrap";

export const ProductShowCaseRow = (props) => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        image: "",
    })
    const [image, setImage] = useState(null);

    const getImage = (name) => {
        const load = async () => {
            setImage(await imageHelper.getImageFromServer(name, "product"));
        }

        load().then(() => null);
    }

    useEffect(() => {
        setProduct(props.product);
        getImage(props.product.image)
    }, [props.product]);

    return (
        <div className="card d-flex justify-content-center align-items-lg-center custom-shadow" style={{ width: "25%", padding: "1rem"}}>
            <div>
                <Image src={image}
                       fluid width="210" title={product.name}/>
            </div>
            <div>
                <p>{product.description}</p>
                <p>à partir de R$ {product.price.toFixed(2)}</p>
            </div>
        </div>
    );
}