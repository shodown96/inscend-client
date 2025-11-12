export interface Product {
    id: string;
    name: string;
    category: string;
    sku: string;
    stock: number;
    unitPrice: number;
    costPrice: number;
    lowStockThreshold: number;
    supplier: string;
    metadata: null;
    businessId: string;
    createdAt: string;
    updatedAt: string;
}