import {useCallback, useContext, useEffect, useState} from "react";
import {StatusCodes} from "http-status-codes";
import {AlertType, ApplicationContext} from "../context/ApplicationContext";
import {productsApi} from "../api/ProductsAPI";
import {Product} from "../domain/Product";

const useProducts = () => {
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState<Product[]>([]);
    const { handleAlert } = appCtx;

    const loadProducts = useCallback(async () => {
        const result = await productsApi.withToken(appCtx.userData.authToken).list();
        if (result.statusCode !== StatusCodes.OK) {
            handleAlert(true, AlertType.DANGER, result.name, result.description);
            setProducts([]);
        } else {
            setProducts(result.data);
        }
    },[appCtx.userData.authToken, handleAlert])

    const findProduct = (name): Product => {
        return products.find(p => p.name === name);
    }

    useEffect(() => {
        loadProducts().then(undefined)
    }, [loadProducts]);

    return {
        products,
        findProduct,
    };
}

export default useProducts;