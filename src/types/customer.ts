export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    notes: string;
    businessId: string;
    createdAt: string;
    updatedAt: string;
    avatar?: { id: string, url: string }
}
