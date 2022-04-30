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

    const list = useCallback(async () => {
        const result = await productsApi.list();
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
    }, [dispatch])

    const get = useCallback(async (id: string) => {
        const result = await productsApi.get(id);
        if (result.statusCode !== StatusCodes.OK) {
            dispatch(uiActions.handleAlert({
                show: true,
                type: AlertType.DANGER,
                title: result.name,
                message: result.description
            }));
        } else {
            return result.data;
        }
    }, [dispatch])

    const findProduct = (name: string): Product => {
        return products.find(p => p.name === name);
    }

    const create = useCallback(async (product: Product) => {
        try {
            const result = await productsApi.withToken(loggedUser.authToken).create(product);
            if (result.statusCode !== StatusCodes.CREATED) {
                return () =>
                    dispatch(
                        uiActions.handleAlert({
                            show: true,
                            type: AlertType.DANGER,
                            title: result.name,
                            message: JSON.stringify(result.description),
                        })
                    );
            }
        } catch (error) {
            console.error(error);
        }
    }, [loggedUser.authToken, dispatch])

    const update = useCallback(async (id: string, product: Product) => {
        try {
            const result = await productsApi.withToken(loggedUser.authToken).update(id, product);
            if (result.statusCode !== StatusCodes.OK) {
                return () =>
                    dispatch(
                        uiActions.handleAlert({
                            show: true,
                            type: AlertType.DANGER,
                            title: result.name,
                            message: JSON.stringify(result.description),
                        })
                    );
            }
        } catch (error) {
            console.error(error);
        }
    }, [loggedUser.authToken, dispatch])

    const remove = useCallback(
        async (product: Product) => {
            try {
                const result = await productsApi.withToken(loggedUser.authToken).delete(product._id);
                if (result && result.statusCode !== StatusCodes.OK) {
                    console.error(result.name, result.description);
                    return () =>
                        dispatch(
                            uiActions.handleAlert({
                                show: true,
                                type: AlertType.DANGER,
                                title: result.name,
                                message: JSON.stringify(result.description),
                            })
                        );
                } else {
                    await list();
                    return () =>
                        dispatch(
                            uiActions.handleAlert({
                                show: true,
                                type: AlertType.WARNING,
                                title: "Delete Product",
                                message: `Product '${product.name}' deleted successfully`
                            })
                        );
                }
            } catch (error) {
                console.error(error);
            }
        },
        [loggedUser.authToken, dispatch, list]
    );

    useEffect(() => {
        list().then(undefined)
    }, [list]);

    return {
        products,
        list,
        get,
        findProduct,
        create,
        update,
        remove,
    };
}

export default useProductsApi;