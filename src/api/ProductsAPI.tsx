import axios, {processRequestError} from "./axios";
import { Product } from "../domain/Product";

const PRODUCTS_URL = "/products";

export class ProductsAPI {

    authToken: string = "";

    withToken(authToken: string) {
        this.authToken = authToken;
        return this;
    }

    list = async () => {

        try {
            const res = await axios.get(PRODUCTS_URL);
            return res.data;
        } catch (error: any) {
            processRequestError(error, "product:list");
            return error?.response?.data
        }

    }

    listByType = async (type: string) => {
        try {
            const res = await axios.get(`${PRODUCTS_URL}/productType/${type}`);
            return res.data;
        } catch (error: any) {
            processRequestError(error, "product:get");
            return error?.response?.data
        }
    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${PRODUCTS_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            processRequestError(error, "product:get");
            return error?.response?.data
        }
    }

    create = async (product: Product) => {
        try {
            const res = await axios.post(PRODUCTS_URL, JSON.stringify(product), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "product:create");
            return error?.response?.data
        }

    }

    update = async (id: string, product: Product) => {
        try {
            const res = await axios.put(`${PRODUCTS_URL}/${id}`, JSON.stringify(product), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "product:update");
            return error?.response?.data
        }
    }

    delete = async (id: string) => {
        try {
            await axios.delete(`${PRODUCTS_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return null;
        } catch (error: any) {
            processRequestError(error, "product:delete");
            return error?.response?.data
        }
    }

}

export const productsApi = new ProductsAPI();