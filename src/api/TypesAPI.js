import axios, {processRequestError} from "./axios";

const TYPES_URL = "/productTypes";

export class TypesAPI {

    authToken;

    withToken(authToken) {
        this.authToken = authToken;
        return this;
    }

    list = async () => {

        try {
            const res = await axios.get(TYPES_URL);
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    get = async (id) => {
        try {
            const res = await axios.get(`${TYPES_URL}/${id}`);
            return res.data;
        } catch (error) {
            processRequestError(error);
        }
    }

    create = async (type) => {
        try {
            const res = await axios.post(TYPES_URL, JSON.stringify(type), {
                headers: { "Content-Type": "application/json",
                            "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }

    }

    update = async (id, type) => {
        try {
            const res = await axios.put(`${TYPES_URL}/${id}`, JSON.stringify(type), {
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

    delete = async (id) => {
        try {
            await axios.delete(`${TYPES_URL}/${id}`, {
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



export const typesApi = new TypesAPI();