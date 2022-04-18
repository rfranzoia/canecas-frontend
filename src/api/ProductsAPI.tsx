import axios, {processRequestError} from "./axios";
import { Product } from "../domain/Product";
import {DefaultAPI} from "./DefaultAPI";

const PRODUCTS_URL = "/products";

export class ProductsAPI extends DefaultAPI {

    list = async () => {

        try {
            const res = await axios.get(PRODUCTS_URL);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "product:list");
        }

    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${PRODUCTS_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "product:get");
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
            return processRequestError(error, "product:create");
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
            return processRequestError(error, "product:update");
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
            return processRequestError(error, "product:delete");
        }
    }

}

export const productsApi = new ProductsAPI();