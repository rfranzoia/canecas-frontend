import axios, {processRequestError} from "./axios";

const USERS_URL = "/users";

export class UsersAPI {

    authToken;

    withToken = (authToken) => {
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
        } catch (error) {
            processRequestError(error);
        }

    }

    get = async (id) => {
        try {
            const res = await axios.get(`${USERS_URL}/${id}`, {
                headers: { "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
        }
    }

    create = async (user) => {
        try {
            const res = await axios.post(USERS_URL, JSON.stringify(user), {
                headers: { "Content-Type": "application/json"
                }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
            return error?.response?.data;
        }

    }

    update = async (id, user) => {
        try {
            const res = await axios.put(`${USERS_URL}/${id}`, JSON.stringify(user), {
                headers: { "Content-Type": "application/json",
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
            await axios.delete(`${USERS_URL}/${id}`, {
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

    login = async (email, password) => {
        const credentials = {
            email: email,
            password: password
        }
        try {
            const res = await axios.post(`${USERS_URL}/login`, JSON.stringify(credentials), {
                mode: "cors",
                headers: { "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error) {
            processRequestError(error);
            return error?.response?.data;
        }
    }

}

export const usersApi = new UsersAPI();