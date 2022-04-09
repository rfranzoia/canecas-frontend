import axios, {processRequestError} from "./axios";
import {Type} from "../domain/Type";

const TYPES_URL = "/types";

export class TypesAPI {

    authToken: string = "";

    withToken(authToken: string) {
        this.authToken = authToken;
        return this;
    }

    list = async () => {

        try {
            const res = await axios.get(TYPES_URL);
            return res.data;
        } catch (error: any) {
            processRequestError(error, "type:list");
            return error?.response?.data
        }

    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${TYPES_URL}/${id}`);
            return res.data;
        } catch (error: any) {
            processRequestError(error, "type:get");
            return error?.response?.data
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
            processRequestError(error, "type:create");
            return error?.response?.data
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
            processRequestError(error, "type:update");
            return error?.response?.data
        }
    }

    delete = async (id: string) => {
        try {
            await axios.delete(`${TYPES_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return true;
        } catch (error: any) {
            processRequestError(error, "type:delete");
            return false
        }
    }

}



export const typesApi = new TypesAPI();