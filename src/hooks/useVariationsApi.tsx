import { StatusCodes } from "http-status-codes";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_PAGE_SIZE } from "../api/axios";
import { variationsApi } from "../api/VariationAPI";
import { User } from "../domain/User";
import { Variation } from "../domain/Variation";
import { RootState } from "../store";
import { AlertType, uiActions } from "../store/uiSlice";

const useVariationsApi = (isModal: boolean) => {
    const dispatch = useDispatch();
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentFilter, setCurrentFilter] = useState("");
    const [variations, setVariations] = useState<Variation[]>([]);
    const [variation, setVariation] = useState<Variation>(null);
    const loggedUser = useSelector<RootState, User>((state) => state.auth.user);

    const pageSize = isModal ? DEFAULT_PAGE_SIZE / 2 : DEFAULT_PAGE_SIZE;

    const getTotalPages = useCallback(async () => {
        try {
            const result = await variationsApi.withPageSize(pageSize).count();
            if (result.statusCode !== StatusCodes.OK) {
                setTotalPages(0);
            } else {
                setTotalPages(Math.ceil(result.data.count / pageSize));
            }
        } catch (error) {
            console.error(error);
        }
    }, [pageSize]);

    const list = useCallback(
        async (currPage: number, filter?: string) => {
            const result = await variationsApi.withPageSize(pageSize).listByFilter(currPage, filter);
            if (result.statusCode !== StatusCodes.OK) {
                setVariations([]);
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
                setVariations(result.data);
                setCurrentPage(currPage);
                setCurrentFilter(filter);
            }
        },
        [dispatch, pageSize]
    );

    const get = useCallback(
        async (id: string) => {
            const result = await variationsApi.withToken(loggedUser.authToken).get(id);
            if (result.statusCode !== StatusCodes.OK) {
                console.error(result.name, JSON.stringify(result.description));
                dispatch(
                    uiActions.handleAlert({
                        show: true,
                        type: AlertType.DANGER,
                        title: result.name,
                        message: JSON.stringify(result.description),
                    })
                );
                setVariation(null);
            } else {
                const variation = {
                    _id: result.data._id,
                    product: result.data.product,
                    background: result.data.background,
                    drawings: result.data.drawings,
                    price: result.data.price,
                    image: result.data.image,
                };
                setVariation(variation);
                return variation;
                //imageHelper.getImage(loadImage, result.data.image);
            }
        },
        [dispatch, loggedUser.authToken]
    );

    const create = useCallback(
        async (variation: Variation) => {
            const result = await variationsApi.withToken(loggedUser.authToken).create(variation);
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
            } else {
                await getTotalPages();
                await list(1, currentFilter);
            }
        },
        [dispatch, getTotalPages, list, loggedUser.authToken, currentFilter]
    );

    const update = useCallback(
        async (variation: Variation) => {
            try {
                const result = await variationsApi.withToken(loggedUser.authToken).update(variation._id, variation);
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
                await list(currentPage, currentFilter);
            } catch (error) {
                console.error(error);
            }
        },
        [dispatch, loggedUser.authToken, currentFilter, list, currentPage]
    );

    const remove = useCallback(
        async (id: string) => {
            try {
                const result = await variationsApi.withToken(loggedUser.authToken).delete(id);
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
                    await getTotalPages();
                    await list(1, currentFilter);
                    return () =>
                        dispatch(
                            uiActions.handleAlert({
                                show: true,
                                type: AlertType.WARNING,
                                title: "Delete Variation",
                                message: "Variation deleted successfully",
                            })
                        );
                }
            } catch (error) {
                console.error(error);
            }
        },
        [loggedUser.authToken, dispatch, getTotalPages, list, currentFilter]
    );

    useEffect(() => {
        getTotalPages().then(undefined);
    }, [getTotalPages]);

    return {
        variations,
        variation,
        currentPage,
        totalPages,
        list,
        get,
        create,
        update,
        remove,
    };
};

export default useVariationsApi;
