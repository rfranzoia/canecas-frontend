import axios from 'axios';
import {StatusCodes} from "http-status-codes";

export default axios.create({
    baseURL: 'http://192.168.1.116:3500/api'
});

export const processRequestError = (error, callback = () => undefined) => {
    if (error?.response?.status === StatusCodes.UNAUTHORIZED) {
        console.error("Unauthorized access", error?.response?.data);

    } else if (error?.response?.status === StatusCodes.BAD_REQUEST) {
        console.error("Bad request", error?.response?.data)

    } else if (error?.response?.status === StatusCodes.NOT_FOUND) {
        console.error("Not found", error?.response?.data)

    } else if (error?.response?.status === StatusCodes.INTERNAL_SERVER_ERROR) {
        console.error("Internal server error", error?.response?.data)

    } else {
        console.error(error);
    }
    callback();
}

