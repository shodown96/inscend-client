import EmptyIcon from "@/assets/icons/empty.svg?react";
import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import { CustomerTable } from "@/components/custom/customer-table";
import { CustomersModal } from "@/components/custom/customers-modal";
import DashboardCard from "@/components/custom/dashboard-card";
import { ImportModal } from "@/components/custom/import-modal";
import SearchInput from "@/components/custom/input-search";
import { Button } from "@/components/ui/button";
import useAPIQuery from "@/hooks/use-api-query";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { useCustomerStore } from "@/lib/stores/customer";
import { delayDebounceFn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomersPage() {
    const { customers, setCustomers } = useCustomerStore();
    const { query, setQuery, setPagination } = useAPIQuery()
    const [metrics, setMetrics] = useState({
        activeCustomers: "0",
        dormantCustomers: "0",
        vipCustomers: "0",
        atRisk: "0",
    })


    const fetchData = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Customers.Base, {
            params: query
        });
        if (r.status === 200) {
            setCustomers(r.data.result.items)
            setPagination({
                total: r.data.result.totalPages,
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
        if (query.search.length) {
            const delayDebounce = delayDebounceFn(fetchData);
            return () => clearTimeout(delayDebounce);
        } else if (query.page) {
            fetchData()
        }
    }, [query.search]);

    return (
        <div className="p-10">
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
                </>
            ) : (
                <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                    <EmptyIcon />
                    <div>Let’s stock your store</div>
                    <div>Use our structured template to import products in bulk</div>
                    <div className="flex gap-2">
                        <Button>
                            <Upload />
                            <span>Import Product</span>
                        </Button>
                        <Button variant={'outline'}>Download Template</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
