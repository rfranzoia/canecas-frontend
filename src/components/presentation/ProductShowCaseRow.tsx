import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { imageHelper } from "../ui/ImageHelper";

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
        <div className="card d-flex custom-shadow"
             style={{ width: "15%", padding: "1rem", minWidth: "15rem" }}>
            <div className={"d-flex align-items-stretch"}>
                <Image src={image}
                       fluid width="200px" title={product.name}/>
            </div>
            <div>
                <p>{product.description}</p>
                <p>à partir de R$ {product.price.toFixed(2)}</p>
            </div>
        </div>
    );
}