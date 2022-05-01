import { StatusCodes } from "http-status-codes";
import { useSelector } from "react-redux";
import axios, { processRequestError } from "../api/axios";
import { imageHelper } from "../components/ui/ImageHelper";
import { User } from "../domain/User";
import { RootState } from "../store";

const useServiceApi = (origin: string) => {
    const user = useSelector<RootState, User>(state => state.auth.user);

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
                    "Authorization": `Bearer ${user.authToken}`
                }
            });

            return res.data;
        } catch (error: any) {
            console.error("Upload to server Error", JSON.stringify(error.stack))
            if (!error.statusCode) {
                return { statusCode: StatusCodes.BAD_REQUEST, name: "Error uploading", description: error.stack };
            }
            return processRequestError(error, "send:file");
        }
    }

    return {
        uploadImage
    }
}

export default useServiceApi;