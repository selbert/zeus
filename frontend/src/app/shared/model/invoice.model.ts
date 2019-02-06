import { Moment } from 'moment';

export interface OrderItem {
    id?: number;
    productKey?: string;
    count?: number;
    options?: string[];
}

export interface Invoice {
    id?: number;
    referenceId?: string;
    referenceIdShort?: string;
    memo?: string;
    memoPrefix?: string;
    hashHex?: string;
    preimageHex?: string;
    amount?: number;
    amountChf?: number;
    exchangeRate?: number;
    orderName?: string;
    pickupLocation?: string;
    pickupDelayMinutes?: number;
    settled?: boolean;
    creationDate?: Moment;
    settleDate?: Moment;
    paymentRequest?: string;
    orderItems?: OrderItem[];
    invoiceType: InvoiceType;
}

export enum InvoiceType {
    SELF_ORDER = 'SELF_ORDER',
    WEB_SHOP = 'WEB_SHOP',
    DONATION = 'DONATION'
}

export const COLORS = ['Blue', 'Red', 'Green', 'Yellow', 'White', 'Black', 'Purple', 'Pink', 'Brown', 'Grey', 'Orange'];

export const OBJECTS = ['Door', 'Flag', 'Cat', 'Dog', 'Card', 'Shirt', 'Sofa', 'Bottle', 'Bus', 'Hat', 'Vase', 'Paper'];

export function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateOrderName() {
    return random(COLORS) + ' ' + random(OBJECTS);
}
