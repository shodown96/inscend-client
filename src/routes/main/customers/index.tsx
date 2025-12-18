import EmptyIcon from "@/assets/icons/empty.svg?react";
import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import { CustomerTable } from "@/components/custom/customer-table";
import { CustomersModal } from "@/components/custom/customers-modal";
import DashboardCard from "@/components/custom/dashboard-card";
import { EditCustomerModal } from "@/components/custom/edit-customers-modal";
import { ImportModal } from "@/components/custom/import-modal";
import SearchInput from "@/components/custom/input-search";
import Loader from "@/components/custom/loader";
import { TablePagination } from "@/components/custom/table-pagination";
import useAPIQuery from "@/hooks/use-api-query";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants";
import { useCustomerStore } from "@/lib/stores/customer";
import { delayDebounceFn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function CustomersPage() {
    const [loading, setLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const customerId = searchParams.get("customer")
    const { customers, setCustomers, openEditModalOpen } = useCustomerStore();
    const { query, pagination, setQuery, setPagination } = useAPIQuery()
    const [metrics, setMetrics] = useState({
        activeCustomers: "0",
        dormantCustomers: "0",
        vipCustomers: "0",
        atRisk: "0",
    })

    const fetchProductData = async () => {
        setLoading(true)
        const r = await mainClient.get(API_ENDPOINTS.Customers.ById(customerId!));
        if (r.data.result.id) {
            setSearchParams("")
            openEditModalOpen(r.data.result)
        }
        setLoading(false)
    }


    const fetchData = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Customers.Base, {
            params: query
        });
        if (r.status === 200) {
            setCustomers(r.data.result.items)
            setPagination({
                total: r.data.result.total,
                totalPages: r.data.result.totalPages,
                currentPage: r.data.result.currentPage,
            });
        }
    }

    const fetchMetrics = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Customers.Analytics);
        if (r.status === 200) {
            setMetrics(r.data.result)
        }
    }

    useEffect(() => {
        fetchMetrics()
    }, [])


    useEffect(() => {
        if (customerId) {
            fetchProductData()
        }
    }, [customerId])

    useEffect(() => {
        if (query.search.length) {
            const delayDebounce = delayDebounceFn(fetchData);
            return () => clearTimeout(delayDebounce);
        } else if (query.page) {
            fetchData()
        }
    }, [query.search, query.page]);

    return (
        <Loader loading={loading}>
            <div className="p-10">
                <title>{`Customers | ${APP_NAME}`}</title>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="font-semibold text-xl">Customers & Insights</h4>
                        <p className="text-sm">A list of every customer your store has interacted with.</p>
                    </div>
                    <div className="flex gap-2">
                        <CustomersModal />
                        <ImportModal type="Customers" />
                        <BrainstormDialog outlined />
                    </div>
                </div>
                <div className="border rounded-lg bg-white grid grid-cols-12 mb-4">
                    <DashboardCard
                        title="Active Cutomers"
                        description={metrics.activeCustomers}
                        bordered
                    />
                    <DashboardCard
                        title="Dormant Customers"
                        description={metrics.dormantCustomers}
                        bordered
                    />
                    <DashboardCard
                        title="VIP Customers"
                        description={metrics.vipCustomers}
                        bordered
                    />
                    <DashboardCard
                        title="At Risk"
                        description={metrics.atRisk}
                    />
                </div>
                {customers.length ? (
                    <>
                        <div className="mb-4 flex justify-end">
                            <SearchInput
                                value={query.search}
                                onValueChange={v => setQuery({ search: v })}
                            />
                        </div>
                        <CustomerTable customers={customers} />
                        <TablePagination
                            pagination={pagination}
                            onPageChange={page => setQuery({ page })}
                        />
                    </>
                ) : (
                    <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                        <EmptyIcon />
                        <div>Let’s stock your store</div>
                        <div>Use our structured template to import products in bulk</div>
                        <div className="flex gap-2">
                            <ImportModal type="Customers" />
                        </div>
                    </div>
                )}
                <EditCustomerModal />
            </div>
        </Loader>
    )
}
