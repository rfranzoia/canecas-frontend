
class ImageHelper {
    getImageUrl = (url) => {
        if (url.startsWith("http")) {
            return url;
        } else {
            return `${BASE_IMAGE_URL}${url}`;
        }
    }
}

export const BASE_IMAGE_URL = "http://192.168.1.116:3000/";

export const imageHelper = new ImageHelper();