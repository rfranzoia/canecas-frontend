import { StatusCodes } from "http-status-codes";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { productsApi } from "../api/ProductsAPI";
import { ApplicationContext } from "../context/ApplicationContext";
import { Product } from "../domain/Product";
import { AlertType, uiActions } from "../store/uiSlice";

const useProducts = () => {
    const dispatch = useDispatch();
    const appCtx = useContext(ApplicationContext);
    const [products, setProducts] = useState<Product[]>([]);
    const { getToken } = appCtx;

    const loadProducts = useCallback(async () => {
        const result = await productsApi.withToken(getToken()).list();
        if (result.statusCode !== StatusCodes.OK) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
            setProducts([]);
        } else {
            setProducts(result.data);
        }
    }, [getToken, dispatch])

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