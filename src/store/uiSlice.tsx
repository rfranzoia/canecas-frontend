import { createSlice } from "@reduxjs/toolkit";

export enum AlertType { DANGER = "danger", SUCCESS = "success", WARNING = "warning",  INFO = "info", }

export const ALERT_TIMEOUT = 5 * 1000;

export interface ToastAlert {
    show: boolean,
    type?: string,
    title?: string,
    message?: string
}

const emptyAlert = {
    show: false,
    type: "",
    title: "",
    message: "",
}

const initAlert = {
    alert: emptyAlert,
}

const uiSlice = createSlice({
    name: "ui",
    initialState: initAlert,
    reducers: {
        handleAlert(state, action) {
            const alert = action.payload;
            state.alert = alert.show? alert: initAlert;
        }
    }
});

export const uiActions = uiSlice.actions;

export default uiSlice;