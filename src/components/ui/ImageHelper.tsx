class ImageHelper {

    getImageFromClient = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) {
            return url;
        } else {
            return `${BASE_CLIENT_IMAGE_URL}${url}`;
        }
    }

    getImageFromServer = (imageName) => {
        if (!imageName) return null;
        return new Promise(async (resolve) => {
            const imageUrl = `${BASE_SERVER_IMAGES_URL}${imageName}`;
            const response = await fetch(imageUrl);
            const imageBlob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data);
            };
        })
    }

    convertToBase64 = async (file) => {
        return new Promise((resolve) => {
            try {
                let reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = (error) => {
                    console.error("Reader ERROR:", error);
                    resolve(null);
                };
            } catch (error) {
                console.error("Reader EXCEPTION:", error);
                resolve(null);
            }
        });
    }

    getImage = (loadImage: Function, name: string) => {
        loadImage(name).then(() => null);
    }
}

export enum ImageOpType { VIEW, EDIT, NEW}

export const BASE_SERVER_IMAGES_URL = `http://192.168.1.116:3500/api/images/`

export const BASE_CLIENT_IMAGE_URL = "http://192.168.1.116:3000/";

export const imageHelper = new ImageHelper();