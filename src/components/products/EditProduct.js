import {productsApi} from "../../api/ProductsAPI";
import {EditProductForm} from "./EditProductForm";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";

export const EditProduct = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        type: "",
        image: ""
    });

    const handleSaveProduct = (product) => {
        const callback = async (product) => {
            if (props.op === "edit") {
                await productsApi.withToken(appCtx.userData.authToken).update(props.id, product)
            } else if (props.op === "new") {
                await productsApi.withToken(appCtx.userData.authToken).create(product);
            }
        }
        callback(product)
            .then(() => props.onSaveCancel());

    }

    const handleCancel = () => {
        props.onSaveCancel();
    }

    useEffect(() => {
        const callback = async () => {
            if (props.op === "edit" || props.op === "view") {
                const p = await productsApi.get(props.id);
                setProduct(p);
            } else {
                setProduct({
                    name: "",
                    description: "",
                    price: 0,
                    type: "",
                    image: ""
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, props.op]);

    const title = props.op === "new" ? "New" :
        props.op === "edit" ? "Edit" : "View";

    const handleOp = (product) => {
        if (props.op !== "view") {
            handleSaveProduct(product);
        }
    }

    return (
        <div style={{padding: "0.3rem", border: "solid"}}>
            <div style={{backgroundColor: "#f1f1f1", verticalAlign: "middle", display: "flex"}}>
                <h3>{`${title} Product`}</h3>
                <hr/>
            </div>
            <div>
                <EditProductForm product={product} op={props.op} onSaveProduct={handleOp} onCancel={handleCancel}/>
            </div>
        </div>
    );
}