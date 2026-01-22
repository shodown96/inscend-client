import type { LucideIcon } from "lucide-react";

export interface APIResponse<T = any> {
    apiObject: string;
    code: number;
    status: string;
    message: string;
    result: T;
}
export interface Pagination {
    totalPages: number;
    currentPage: number;
    total: number;
}

export interface APIQuery {
    pageSize: number,
    page: number,
    search: string,
}

export interface PaginatedData<T = any> extends Pagination {
    items: T[];
    pageSize: number;
}

export type AppIcon = LucideIcon | React.FunctionComponent<React.SVGProps<SVGSVGElement> & {
    title?: string;
    titleId?: string;
    desc?: string;
    descId?: string;
}>

export interface BackgroundTask {
    id: string;
    businessId: string;
    type: string;
    status: 'completed' | 'failed' | 'pending' | 'running';
    createdAt: string;
    updatedAt: string;
}