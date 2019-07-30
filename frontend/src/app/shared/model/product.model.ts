export interface CartItem {
    selection: string;
}

export interface Configuration {
    products: Product[];
    locations: PickupLocation[];
    allowPickupDelay: boolean;
    weeklyOpeningHours: OpeningHours;
}

export interface Product {
    title: string;
    productKey: string;
    price: number;
    options: string[];
    cart: CartItem[];
}

export interface PickupLocation {
    name: string;
    key: string;
}

export interface FrontendConfiguration {
    selfService: SelfServiceConfiguration;
    [key: string]: BeerTapConfiguration | SelfServiceConfiguration;
}

export interface SelfServiceConfiguration {
    products: SelfServiceProduct[];
}

export interface BeerTapConfiguration {
    products: BeerTapProduct[];
    orderName: string;
}

export interface SelfServiceProduct {
    productKey: string;
    optionOverride?: string[];
    titleOverride?: string;
}

export interface BeerTapProduct {
    title: string;
    productKey: string;
    amount: number;
    amountInSats: boolean;
    subtitle: string;
}

export type OpeningHours = { [K in WeekDay]: OpeningHour };

export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface OpeningHour {
    openingHour: string;
    closingHour: string;
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function getProductByKey(products: Product[], productKey: string): Product {
    return products.filter(p => p.productKey === productKey)[0];
}

export function getSummaryItem(products: Product[], productKey: string, option: string) {
    const product = getProductByKey(products, productKey);
    return {
        text: `${product.title} ${option}`,
        price: product.price
    };
}
