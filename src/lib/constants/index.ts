export * from "./api";
export * from "./messages";
export * from "./paths";

export const APP_NAME = "Inscend"
export const OTP_COUNTDOWN_TIME = 60;
export const OTP_LENGTH = 6;
export const DEFAULT_PAGE_SIZE = 10

export const BUSINESS_TYPES = [
    { label: "Retail", value: "Retail" },
    { label: "Restaurant", value: "Restaurant" },
    { label: "Service", value: "Service" },
    { label: "Manufacturing", value: "Manufacturing" },
    { label: "Others", value: "Others" }
]

export const CATEGORIES = [
    { label: "Electronics", value: "Electronics" },
    { label: "Clothing & Accessories", value: "Clothing & Accessories" },
    { label: "Books & Media", value: "Books & Media" },
    { label: "Home & Garden", value: "Home & Garden" },
    { label: "Sports & Outdoors", value: "Sports & Outdoors" },
    { label: "Health & Beauty", value: "Health & Beauty" },
    { label: "Food & Beverages", value: "Food & Beverages" },
    { label: "Toys & Games", value: "Toys & Games" },
    { label: "Automotive", value: "Automotive" },
    { label: "Office Supplies", value: "Office Supplies" },
    { label: "General", value: "General" },
    { label: "Services", value: "Services" },
]

export const PAYMENT_METHODS = [
    { label: "Card", value: "Card" },
    { label: "Cash", value: "Cash" },
]