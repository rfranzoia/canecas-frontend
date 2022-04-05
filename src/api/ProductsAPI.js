import axios, {processRequestError} from "./axios";

const PRODUCTS_URL = "/products";

export class ProductsAPI {

    authToken;

    withToken(authToken) {
        this.authToken = authToken;
        return this;
    }

    list = async () => {

        try {
            const res = await axios.get(PRODUCTS_URL);
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    listByType = async (type) => {

        try {
            const res = await axios.get(`${PRODUCTS_URL}/type/${type}`);
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    get = async (id) => {
        try {
            const res = await axios.get(`${PRODUCTS_URL}/${id}`);
            return res.data;
        } catch (error) {
            processRequestError(error);
        }
    }

    create = async (product) => {
        try {
            const res = await axios.post(PRODUCTS_URL, JSON.stringify(product), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    update = async (id, product) => {
        try {
            const res = await axios.put(`${PRODUCTS_URL}/${id}`, JSON.stringify(product), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }
    }

    delete = async (id) => {
        try {
            await axios.delete(`${PRODUCTS_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return true;
        } catch (error) {
            processRequestError(error);
            return false
        }
    }

}

export const productsApi = new ProductsAPI();