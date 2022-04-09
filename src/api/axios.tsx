import axios from 'axios';
import {StatusCodes} from "http-status-codes";

export default axios.create({
    baseURL: 'http://192.168.1.116:3500/api'
});

export const processRequestError = (error: any, method: string = "", callback = () => undefined) => {
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
    callback();
}

