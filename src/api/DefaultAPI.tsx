import { DEFAULT_PAGE_SIZE } from "./axios";

export class DefaultAPI {

    authToken: string = "";
    pageSize: number = DEFAULT_PAGE_SIZE;

    withToken(authToken: string) {
        this.authToken = authToken;
        return this;
    }

    withPageSize(pageSize: number) {
        this.pageSize = pageSize;
        return this;
    }

}