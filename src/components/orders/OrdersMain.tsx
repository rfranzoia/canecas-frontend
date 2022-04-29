import { OrdersContextProvider } from "../../context/OrdersContext";
import { Orders } from "./Orders";

export const OrdersMain = (props) => {
    return (
        <OrdersContextProvider>
            <Orders {...props}/>
        </OrdersContextProvider>
    );
}