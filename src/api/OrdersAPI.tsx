import axios, {processRequestError} from "./axios";
import { Order } from "../domain/Order";

const ORDERS_URL = "/orders";

export class OrdersAPI {

    authToken: string = "";

    withToken(authToken: string) {
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
        } catch (error: any) {
            processRequestError(error, "order:list");
            return error?.response?.data
        }

    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${ORDERS_URL}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "order:get");
            return error?.response?.data
        }
    }

    create = async (order: Order) => {
        try {
            const res = await axios.post(ORDERS_URL, JSON.stringify(order), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error);
            return error?.response?.data
        }

    }

    update = async (id: string, order: Order) => {
        try {
            const res = await axios.put(`${ORDERS_URL}/${id}`, JSON.stringify(order), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "order:update");
            return error?.response?.data;
        }
    }

    delete = async (id: string) => {
        try {
            await axios.delete(`${ORDERS_URL}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return null;
        } catch (error: any) {
            processRequestError(error, "order:delete");
            return error?.response?.data
        }
    }

}

export const ordersApi = new OrdersAPI();