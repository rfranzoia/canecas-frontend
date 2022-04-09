import axios, {processRequestError} from "./axios";
import { User } from "../domain/User";

const USERS_URL = "/users";

export class UsersAPI {

    authToken: string = "";

    withToken = (authToken: string) => {
        this.authToken = authToken;
        return this;
    }

    list = async () => {

        try {
            const res = await axios.get(USERS_URL, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "user:list");
            return error?.response?.data
        }

    }

    get = async (id: string) => {
        try {
            const res = await axios.get(`${USERS_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "user:get");
            return error?.response?.data
        }
    }

    create = async (user: User) => {
        try {
            const res = await axios.post(USERS_URL, JSON.stringify(user), {
                headers: { "Content-Type": "application/json"
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "user:create");
            return error?.response?.data;
        }

    }

    update = async (id: string, user: User) => {
        try {
            const res = await axios.put(`${USERS_URL}/${id}`, JSON.stringify(user), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error, "user:update");
            return error?.response?.data
        }
    }

    delete = async (id: string) => {
        try {
            await axios.delete(`${USERS_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return null;
        } catch (error: any) {
            processRequestError(error, "user:delete");
            return error?.response?.data
        }
    }

    login = async (email: string, password: string) => {
        const credentials = {
            email: email,
            password: password
        }
        try {
            const res = await axios.post(`${USERS_URL}/login`, JSON.stringify(credentials), {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error);
            return error?.response?.data;
        }
    }

    updatePassword = async (email: string, password: string, newPassword: string) => {
        const credentials = {
            email: email,
            currentPassword: password,
            newPassword: newPassword
        }
        try {
            const res = await axios.post(`${USERS_URL}/password`, JSON.stringify(credentials), {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            processRequestError(error);
            return error?.response?.data;
        }
    }

}

export const usersApi = new UsersAPI();