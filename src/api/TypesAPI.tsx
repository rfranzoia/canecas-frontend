import axios, {processRequestError} from "./axios";
import {Type} from "../domain/Type";
import {DefaultAPI} from "./DefaultAPI";

const TYPES_URL = "/types";

export class TypesAPI extends DefaultAPI {

    list = async () => {

        try {
            const res = await axios.get(TYPES_URL);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "type:list");
        }

    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${TYPES_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "type:get");
        }
    }

    create = async (type: Type) => {
        try {
            const res = await axios.post(TYPES_URL, JSON.stringify(type), {
                headers: { "Content-Type": "application/json",
                            "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "type:create");
        }

    }

    update = async (id: string, type: Type) => {
        try {
            const res = await axios.put(`${TYPES_URL}/${id}`, JSON.stringify(type), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "type:update");
        }
    }

    delete = async (id: string) => {
        try {
            await axios.delete(`${TYPES_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return null;
        } catch (error: any) {
            return processRequestError(error, "type:delete");
        }
    }

}



export const typesApi = new TypesAPI();