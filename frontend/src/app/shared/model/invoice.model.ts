import { Moment } from 'moment';

export enum OrderItemType {
    LARGE_BEER = 'LARGE_BEER',
    SMALL_BEER = 'SMALL_BEER'
}

export interface OrderItem {
    id?: number;
    itemType?: OrderItemType;
    count?: number;
    options?: string[];
    total?: number;
}

export interface Invoice {
    id?: number;
    referenceId?: string;
    referenceIdShort?: string;
    memo?: string;
    hashHex?: string;
    preimageHex?: string;
    amount?: number;
    amountChf?: number;
    exchangeRate?: number;
    orderName?: string;
    settled?: boolean;
    creationDate?: Moment;
    settleDate?: Moment;
    paymentRequest?: string;
    orderItems?: OrderItem[];
    total?: number;
    autoGenerated?: boolean;
    memoPrefix?: string;
}

export const COLORS = ['Blue', 'Red', 'Green', 'Yellow', 'White', 'Black', 'Purple', 'Pink', 'Brown', 'Grey', 'Orange'];

export const OBJECTS = ['Door', 'Flag', 'Cat', 'Dog', 'Card', 'Shirt', 'Sofa', 'Bottle', 'Bus', 'Hat', 'Vase', 'Paper'];

export function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function generateOrderName() {
    return random(COLORS) + ' ' + random(OBJECTS);
}