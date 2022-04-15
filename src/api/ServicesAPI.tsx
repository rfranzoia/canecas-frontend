import axios, {processRequestError} from "./axios";
import {imageHelper} from "../components/ui/ImageHelper";
import {DefaultAPI} from "./DefaultAPI";

export class ServicesAPI extends DefaultAPI {

    uploadImage = async (file) => {
        try {
            const data = await imageHelper.convertToBase64(file);
            if (!data) {
                console.error("No data to convert!!");
                return null;
            }

            const obj = {
                name: file.name,
                data: data
            }

            const res = await axios.post("/services/file/upload", obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.authToken}`
                }
            });

            return res.data;
        } catch (error: any) {
            console.error("Upload to server ERROR", error)
            if (!error.statusCode) {
                return error;
            }
            return processRequestError(error, "send:file");
        }
    }
}

export const servicesApi = new ServicesAPI();