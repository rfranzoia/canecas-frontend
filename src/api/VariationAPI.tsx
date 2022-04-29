import { Variation } from "../domain/Variation";
import axios, { processRequestError } from "./axios";
import { DefaultAPI } from "./DefaultAPI";

const VARIATIONS_URL = "/productVariations";

export class VariationsAPI extends DefaultAPI {
    list = async (currPage: number = 1) => {
        try {
            const res = await axios.get(`${VARIATIONS_URL}?pageSize=${this.pageSize}&pageNumber=${currPage}`);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variations:list");
        }
    };

    listByFilter = async (currPage: number, filter: string) => {
        const pageFilter = filter && filter.startsWith("?") ? filter.concat("&") : "?";
        const url = `${VARIATIONS_URL}/filterBy${pageFilter}pageSize=${this.pageSize}&pageNumber=${currPage}`;

        try {
            const res = await axios.get(url);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variation:listByFilter");
        }
    };

    count = async () => {
        try {
            const res = await axios.get(`${VARIATIONS_URL}/count`);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variation:count");
        }
    };

    get = async (id: string) => {
        try {
            const res = await axios.get(`${VARIATIONS_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variation:get");
        }
    };

    create = async (variation: Variation) => {
        try {
            const res = await axios.post(VARIATIONS_URL, JSON.stringify(variation), {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.authToken}` },
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variation:create");
        }
    };

    update = async (id: string, variation: Variation) => {
        try {
            const res = await axios.put(`${VARIATIONS_URL}/${id}`, JSON.stringify(variation), {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.authToken}` },
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "variation:update");
        }
    };

    delete = async (id: string) => {
        try {
            await axios.delete(`${VARIATIONS_URL}/${id}`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.authToken}` },
            });
            return null;
        } catch (error: any) {
            return processRequestError(error, "variation:delete");
        }
    };
}

export const variationsApi = new VariationsAPI();
