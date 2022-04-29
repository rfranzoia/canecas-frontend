import { createSlice } from "@reduxjs/toolkit"
import {User} from "../domain/User";

interface AuthSlice {
    isLoggedIn: boolean,
    user: User,
}

const emptyUser = {
    _id: "",
    name: "",
    email: "",
    authToken: "",
    role: "",
}

const initialState: AuthSlice = {
    isLoggedIn: false,
    user: emptyUser,
}

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        login(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload;
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = emptyUser;
            localStorage.setItem("userData", JSON.stringify(emptyUser));
        },
        checkLocalStorage(state) {
            const storage = JSON.parse(localStorage.getItem("userData"));
            if (storage) {
                state.user = storage;
            }
            state.isLoggedIn = state.user.authToken !== "";
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice;