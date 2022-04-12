import {productsApi} from "../../api/ProductsAPI";
import {EditProductForm} from "./EditProductForm";
import {useContext, useEffect, useState} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";

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
        const save = async (product) => {
            let result;
            if (props.op === "edit") {
                result = await productsApi.withToken(appCtx.userData.authToken).update(props.id, product)
            } else if (props.op === "new") {
                result = await productsApi.withToken(appCtx.userData.authToken).create(product);
            }
            if (result.statusCode) {
                if (result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                    handleCancel();
                } else if (result.statusCode === StatusCodes.BAD_REQUEST) {
                    handleCancel(result)
                } else if (result.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
                    handleCancel(result);
                }
            } else {
                handleCancel();
            }
        }
        save(product)
            .then(() => undefined);
    }

    const handleCancel = (error?) => {
        props.onSaveCancel(error);
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

    const handleOp = (product) => {
        if (props.op !== "view") {
            handleSaveProduct(product);
        }
    }

    return (
        <>
            <EditProductForm product={product} op={props.op} onSaveProduct={handleOp} onCancel={handleCancel}/>
        </>
    );
}
