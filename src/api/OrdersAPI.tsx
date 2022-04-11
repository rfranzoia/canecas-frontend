import axios, {processRequestError} from "./axios";
import {Order, OrderItem} from "../domain/Order";

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
            return processRequestError(error, "order:list");
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
            return processRequestError(error, "order:get");
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
            return processRequestError(error);
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
            return processRequestError(error, "order:update");
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
            return processRequestError(error, "order:delete");
        }
    }

    evaluateTotalPrice = (items: OrderItem[]) => {
        return items.reduce((acc, item) => {
            return acc + (item.price * item.amount);
        }, 0);
    }

}

export const ordersApi = new OrdersAPI();