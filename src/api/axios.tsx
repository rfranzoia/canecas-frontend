import axios from 'axios';
import {StatusCodes} from "http-status-codes";

enum Environment { DEV, PROD}

const apiServers = [ "http://192.168.1.116:3500", ""];
const contentServers = [ "http://192.168.1.116:3000", ""];

export const CONTENT_SERVER_ADDRESS = contentServers[Environment.DEV];
export const API_SERVER_ADDRESS = apiServers[Environment.DEV];

export const BASE_API_URL = `${API_SERVER_ADDRESS}/api`;

export const DEFAULT_PAGE_SIZE = 8;
export const DEFAULT_BOUNDARIES = 1;
export const DEFAULT_AROUND = 1;

export default axios.create({
    baseURL: BASE_API_URL
});

export const processRequestError = (error: any, method: string = "") => {
    if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
        console.error(`Unauthorized access from ${method}`, error?.response?.data);

    } else if (error?.response?.status === StatusCodes.BAD_REQUEST) {
        console.error(`Bad request from ${method}`, error?.response?.data)

    } else if (error?.response?.status === StatusCodes.NOT_FOUND) {
        console.error(`Not found from ${method}`, error?.response?.data)

    } else if (error?.response?.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        console.error(`Internal server error from ${method}`, error?.response?.data)

    } else {
        console.error(`Error from ${method}`, error);
    }
    return error?.response?.data;
}

