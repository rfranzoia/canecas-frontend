import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productsApi } from "../api/ProductsAPI";
import { Product } from "../domain/Product";
import { User } from "../domain/User";
import { RootState } from "../store";
import { AlertType, uiActions } from "../store/uiSlice";

const useProductsApi = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const loggedUser = useSelector<RootState, User>((state) => state.auth.user);

    const loadProducts = useCallback(async () => {
        const result = await productsApi.withToken(loggedUser.authToken).list();
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
    }, [loggedUser.authToken, dispatch])

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

export default useProductsApi;