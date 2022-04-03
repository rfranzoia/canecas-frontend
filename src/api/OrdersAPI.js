import axios, {processRequestError} from "./axios";

const ORDERS_URL = "/orders";

export class OrdersAPI {

    authToken;

    withToken(authToken) {
        this.authToken = authToken;
        return this;
    }

    list = async () => {
        try {
            const res = await axios.get(ORDERS_URL, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    get = async (id) => {
        try {
            const res = await axios.get(`${ORDERS_URL}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }
    }

    create = async (order) => {
        try {
            const res = await axios.post(ORDERS_URL, JSON.stringify(order), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
            return error;
        }

    }

    update = async (id, order) => {
        try {
            const res = await axios.put(`${ORDERS_URL}/${id}`, JSON.stringify(order), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
            return error;
        }
    }

    delete = async (id) => {
        try {
            await axios.delete(`${ORDERS_URL}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
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

export const ordersApi = new OrdersAPI();