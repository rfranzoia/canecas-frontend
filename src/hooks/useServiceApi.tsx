import {imageHelper} from "../components/ui/ImageHelper";
import axios, {processRequestError} from "../api/axios";
import {useContext} from "react";
import {ApplicationContext} from "../context/ApplicationContext";

const useServiceApi = (origin: string) => {
    const appCtx = useContext(ApplicationContext);

    const uploadImage = async (file) => {
        try {
            const data = await imageHelper.convertToBase64(file);
            if (!data) {
                console.error("No data to convert!!");
                return null;
            }

            const obj = {
                origin: origin,
                name: file.name,
                data: data
            }
            const res = await axios.post("/services/file/upload", obj, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${appCtx.userData.authToken}`
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

    return {
        uploadImage
    }
}

export default useServiceApi;