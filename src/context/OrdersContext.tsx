import {createContext} from "react";

export interface OrdersCtx {}

const defaultValue: OrdersCtx = {}

export const OrdersContext = createContext(defaultValue);

export const OrdersContextProvider = (props) => {
    const context: OrdersCtx = {}

    return (
        <OrdersContext.Provider value={context}>
            {props.children}
        </OrdersContext.Provider>
    );
}
