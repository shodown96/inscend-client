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