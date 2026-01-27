import EmptySalesIcon from "@/assets/icons/empty-sales.svg?react";
import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import DashboardCard from "@/components/custom/dashboard-card";
import { EditSalesModal } from "@/components/custom/edit-sales-modal";
import { ImportModal } from "@/components/custom/import-modal";
import SearchInput from "@/components/custom/input-search";
import { SalesModal } from "@/components/custom/sales-modal";
import { SalesTable } from "@/components/custom/sales-table";
import { TablePagination } from "@/components/custom/table-pagination";
import useAPIQuery from "@/hooks/use-api-query";
import useAppTour from "@/hooks/use-app-tour";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants";
import { useSalesStore } from "@/lib/stores/sale";
import { delayDebounceFn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SalesPage() {
    const { sales, setSales } = useSalesStore();
    const { query, pagination, setQuery, setPagination } = useAPIQuery()
    const [metrics, setMetrics] = useState({
        topSellingToday: "0",
        totalSalesToday: "0",
        revenueThisWeek: "0",
        returningCustomers: "0",
    })
    useAppTour('sales')

    const fetchData = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Sales.Base, {
            params: query
        });
        if (r.data.result.items) {
            setSales(r.data.result.items)
            setPagination({
                total: r.data.result.total,
                totalPages: r.data.result.totalPages,
                currentPage: r.data.result.currentPage,
            });
        }
    }

    const fetchMetrics = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Sales.Analytics);
        if (r.status === 200) {
            setMetrics(r.data.result)
        }
    }

    useEffect(() => {
        if (query.search.length) {
            const delayDebounce = delayDebounceFn(fetchData);
            return () => clearTimeout(delayDebounce);
        } else if (query.page) {
            fetchData()
        }
    }, [query.search, query.page]);

    useEffect(() => {
        fetchMetrics()
    }, [])
    return (
        <div className="p-5 md:p-10" id="sales-welcome">
            <title>{`Sales | ${APP_NAME}`}</title>
            <div className="flex justify-between md:items-center mb-4 max-md:flex-col gap-4">
                <div>
                    <h4 className="text-xl font-semibold">Sales Management</h4>
                    <p>Track and manage your sales transactions</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <SalesModal onFormSubmit={fetchMetrics} />
                    <ImportModal type="Sales" />
                    <BrainstormDialog outlined />
                </div>
            </div>

            <div className="border rounded-lg bg-white grid grid-cols-12 mb-4">
                <DashboardCard
                    title="Top Selling Today"
                    description={metrics.topSellingToday}
                    bordered
                    className="col-span-4"
                />
                <DashboardCard
                    title="Total Sales Today"
                    description={metrics.totalSalesToday}
                    bordered
                    className="col-span-4"
                />
                <DashboardCard
                    title="Revenue This Week"
                    description={metrics.revenueThisWeek}
                    bordered
                    className="col-span-4"
                />
                {/* <DashboardCard
                    title="Returning Customers"
                    description={metrics.returningCustomers}
                /> */}
            </div>
            <div className="mb-4 flex md:justify-end">
                <SearchInput
                    value={query.search}
                    onValueChange={v => setQuery({ search: v })}
                />
            </div>
            {sales.length ? (
                <>
                    <SalesTable sales={sales} />
                    <TablePagination
                        pagination={pagination}
                        onPageChange={page => setQuery({ page })}
                    />
                </>
            ) : (
                <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                    <EmptySalesIcon />
                    <div>No sales yet.</div>
                    <div>Record your first sale manually or import your sales data to get started.</div>
                    <div className="flex gap-2">
                        <ImportModal type="Sales" />
                    </div>
                </div>
            )}
            <EditSalesModal />
        </div>
    )
}
