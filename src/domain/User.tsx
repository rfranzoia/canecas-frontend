
export enum Role { ADMIN = "ADMIN", USER = "USER", GUEST = "GUEST" }

export interface User {
    _id?: string,
    name?: string;
    email: string;
    password?: string;
    role: string
    phone?: string;
    address?: string;
    authToken?: string;
}
