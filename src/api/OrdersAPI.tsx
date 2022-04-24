import axios, {DEFAULT_PAGE_SIZE, processRequestError} from "./axios";
import {Order} from "../domain/Order";
import {DefaultAPI} from "./DefaultAPI";

const ORDERS_URL = "/orders";

export class OrdersAPI extends DefaultAPI {

    count = async () => {
        try {
            const res = await axios.get(`${ORDERS_URL}/count`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "order:count");
        }

    }

    list = async (currPage: number = 1) => {
        try {
            const res = await axios.get(`${ORDERS_URL}?pageSize=${DEFAULT_PAGE_SIZE}&pageNumber=${currPage}`, {
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

    listByFilter = async (currPage: number = 1, filter?: string) => {

        const pageFilter = (filter && filter.startsWith("?"))?filter.concat("&"):"?";
        const url = `${ORDERS_URL}/filterBy${pageFilter}pageSize=${DEFAULT_PAGE_SIZE}&pageNumber=${currPage}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "order:listByFilter");
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
            return processRequestError(error, "order:create");
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

}

export const ordersApi = new OrdersAPI();