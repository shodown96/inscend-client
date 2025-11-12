import type { APIQuery, Pagination } from '@/types';
import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants';

function useAPIQuery() {
    const [query, setQuery] = useState<APIQuery>({
        pageSize: DEFAULT_PAGE_SIZE,
        page: 1,
        search: "",
    })
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 0,
        currentPage: 1,
        total: 0,
    })

    const setP = (values: Partial<Pagination>) => {
        const { totalPages = 0, currentPage = 1, total = 0, } = values
        setPagination({ ...pagination, totalPages, currentPage, total })
    }

    const setQ = (values: Partial<APIQuery>) => {
        const {
            pageSize = DEFAULT_PAGE_SIZE,
            page = 1,
            search = "",
        } = values;
        setQuery({ ...query, pageSize, page, search })
    }

    const resetAPIQuery = () => {
        setPagination({
            totalPages: 0,
            currentPage: 1,
            total: 0,
        })
        setQuery({
            pageSize: DEFAULT_PAGE_SIZE,
            page: 1,
            search: "",
        })
    }

    return {
        query,
        setQuery: setQ,
        pagination,
        setPagination: setP,
        resetAPIQuery,
    }
}

export default useAPIQuery