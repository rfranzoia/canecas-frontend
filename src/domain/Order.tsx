export enum OrderStatus { QUOTE_REQUEST = 0, CONFIRMED_ORDER = 1, IN_PRODUCTION = 2, READY_TO_DELIVER = 3, FINISHED = 8, CANCELED = 9 }

export enum OrderAction {"DELETE" = "DELETE", "CONFIRM" = "CONFIRM", "FORWARD" = "FORWARD"}

export const findNextOrderStatus = (currStatus: OrderStatus): OrderStatus => {
    let leaveOnNext = false;
    for (let s in OrderStatus) {
        if (leaveOnNext) {
            return OrderStatus[OrderStatus[s]];
        }
        if (OrderStatus[s] === OrderStatus[currStatus]) {
            leaveOnNext = true;
        }
    }
    return OrderStatus.QUOTE_REQUEST;
}

export const evaluateTotalPrice = (items: OrderItem[]) => {
    return items.reduce((acc, item) => {
        return acc + (item.price * item.amount);
    }, 0);
}

export const orderStatusAsArray = (): number[] => {
    const statuses = [];
    for (let s in OrderStatus) {
        if (!isNaN(Number(s))) {
            statuses.push(s);
        }
    }
    return statuses;
}

export interface Order {
    _id?: string,
    orderDate?: string,
    userEmail?: string,
    status?: number,
    statusReason?: string,
    totalPrice?: number,
    items?: OrderItem[],
    statusHistory?: OrderStatusHistory[]
}

export interface OrderItem {
    product: string,
    caricatures: number,
    caricatureImages?: string,
    background: string,
    backgroundImage?: string,
    backgroundDescription?: string,
    price: number,
    amount: number
}

export interface OrderStatusHistory {
    changeDate: Date,
    prevStatus: number,
    currStatus: number,
    reason?: string
}