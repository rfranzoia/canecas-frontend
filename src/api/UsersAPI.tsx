import axios, {processRequestError} from "./axios";
import { User } from "../domain/User";
import {DefaultAPI} from "./DefaultAPI";

const USERS_URL = "/users";

export class UsersAPI extends DefaultAPI {

    list = async () => {

        try {
            const res = await axios.get(USERS_URL, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "user:list");
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
            return processRequestError(error, "user:get");
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
            return processRequestError(error, "user:create");
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
            return processRequestError(error, "user:update");
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
            return processRequestError(error, "user:delete");
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
            return processRequestError(error, "users:login");
        }
    }

    validateToken = async (token: string) => {
        const body = {
            token: token
        }
        try {
            const res = await axios.post(`${USERS_URL}/validateToken`, JSON.stringify(body), {
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error: any) {
            return processRequestError(error, "users:validateToken");
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
            return processRequestError(error, "users:updatePassword");
        }
    }

}

export const usersApi = new UsersAPI();