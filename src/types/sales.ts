import type { Customer } from "./customer";
import type { Product } from "./product";

export interface Sale {
    id: string;
    quantity: number;
    unitPrice: number;
    paymentMethod: string;
    notes: string;
    productId: string;
    customerId: null;
    businessId: string;
    createdAt: string;
    updatedAt: string;
    product: Product;
    customer: Customer;
}
