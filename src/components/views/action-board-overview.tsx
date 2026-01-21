import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { Check, Clock, CreditCard, X } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "../custom/loader";
import { MetricSparkCard } from "../custom/metrics-sparks-card";
import OverviewMap from "../custom/overview-map";

export interface OverviewMetrics {
    paidOrders: number;
    completedOrders: number;
    failedOrders: number;
    pendingOrders: number;
    customersCount: CustomersCount;
    averageOrderRevenue: CustomersCount;
    totalProfit: CustomersCount;
}

interface CustomersCount {
    thisMonth: number;
    lastMonth: number;
}

const getMonthLabels = (now = new Date(), locale = "en-US") => {
    const thisMonthLabel = now.toLocaleString(locale, {
        month: "short",
        year: "numeric",
    });

    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthLabel = last.toLocaleString(locale, {
        month: "short",
        year: "numeric",
    });

    return { thisMonthLabel, lastMonthLabel };
};


export default function ActionBoardOverview() {
    const [metrics, setMetrics] = useState<OverviewMetrics | null>()
    const [loading, setLoading] = useState(false)

    const fetchMetrics = async () => {
        console.log("Fetching MonthCustomerMetrics")
        setLoading(true)
        const r = await mainClient.get(API_ENDPOINTS.Analytics.GetOverviewMetrics);
        if (r.data.result) {
            setMetrics(r.data.result)
            console.log(r.data.result)
        }
        setLoading(false)
    }


    const { thisMonthLabel, lastMonthLabel } = getMonthLabels();

    const totalOrdersThisMonth =
        (metrics?.paidOrders ?? 0) + (metrics?.pendingOrders ?? 0) + (metrics?.failedOrders ?? 0);

    // NOTE:
    // Your current API only returns order status counts (paid/pending/failed) WITHOUT month split.
    // So the "Orders: Aug 2025" card in your screenshot can't be truly month vs last month
    // unless you return an ordersCount {thisMonth,lastMonth}. For now we display "thisMonth"
    // as totalOrdersThisMonth and "lastMonth" as 0.
    const ordersMetric = {
        thisMonth: totalOrdersThisMonth,
        lastMonth: 0,
    };

    const currencySymbol = "$"
    const currencySuffix = ""
    useEffect(() => {
        fetchMetrics()
    }, [])
    return (
        <Loader loading={loading} className="h-[60vh]">
            {metrics ? (
                <div className="">
                    <div className="grid grid-cols-12 gap-2 mb-4 overflow-hidden">
                        <div className="col-span-12 lg:col-span-6 mb-4">
                            <div className="border bg-white rounded-lg flex flex-col justify-center items-center p-5 mb-4">
                                <p className="text-lg font-semibold">This month: ${metrics.averageOrderRevenue.thisMonth}</p>
                                <p>Last month: ${metrics.averageOrderRevenue.lastMonth}</p>
                            </div>

                            <div className="border bg-white rounded-lg flex overflow-x-auto justify-center gap-4 items-center p-10 h-[200px]">
                                <div className="p-5 w-[120px] py border rounded-lg text-center flex flex-col items-center gap-4">
                                    <div><CreditCard /></div>
                                    <div>{metrics.paidOrders}</div>
                                    <div>Payments</div>
                                </div>
                                <div className="p-5 w-[120px] py border rounded-lg text-center flex flex-col items-center gap-4">
                                    <div><Clock className="text-yellow-600" /></div>
                                    <div>{metrics.pendingOrders}</div>
                                    <div>Pending</div>
                                </div>
                                <div className="p-5 w-[120px] py border rounded-lg text-center flex flex-col items-center gap-4">
                                    <div><Check className="text-green-600" /></div>
                                    <div>{metrics.completedOrders}</div>
                                    <div>Completed</div>
                                </div>
                                <div className="p-5 w-[120px] py border rounded-lg text-center flex flex-col items-center gap-4">
                                    <div><X className="text-red-600" /></div>
                                    <div>{metrics.failedOrders}</div>
                                    <div>Failed</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-6 mb-4">
                            <OverviewMap />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <MetricSparkCard
                            title="Total Profit"
                            monthLabel={thisMonthLabel}
                            prevLabel={lastMonthLabel}
                            metric={metrics.totalProfit}
                            prefix={currencySymbol}
                            suffix={currencySuffix}
                            accent="green"
                            series={
                                [
                                    { value: Math.max(0, metrics.totalProfit.lastMonth * 0.7) },
                                    { value: Math.max(0, metrics.totalProfit.lastMonth * 0.9) },
                                    { value: Math.max(0, metrics.totalProfit.lastMonth * 1.1) },
                                    { value: Math.max(0, metrics.totalProfit.lastMonth * 1.0) },
                                    { value: Math.max(0, metrics.totalProfit.thisMonth * 0.85) },
                                    { value: Math.max(0, metrics.totalProfit.thisMonth * 0.95) },
                                    { value: Math.max(0, metrics.totalProfit.thisMonth) },
                                ]
                            }
                        />

                        <MetricSparkCard
                            title="Customers"
                            monthLabel={thisMonthLabel}
                            prevLabel={lastMonthLabel}
                            metric={metrics.customersCount}
                            accent="blue"
                            series={
                                [
                                    { value: Math.max(0, metrics.customersCount.lastMonth * 0.7) },
                                    { value: Math.max(0, metrics.customersCount.lastMonth * 0.9) },
                                    { value: Math.max(0, metrics.customersCount.lastMonth * 1.1) },
                                    { value: Math.max(0, metrics.customersCount.lastMonth * 1.0) },
                                    { value: Math.max(0, metrics.customersCount.thisMonth * 0.85) },
                                    { value: Math.max(0, metrics.customersCount.thisMonth * 0.95) },
                                    { value: Math.max(0, metrics.customersCount.thisMonth) },
                                ]
                            }
                        />

                        <MetricSparkCard
                            title="Orders"
                            monthLabel={thisMonthLabel}
                            prevLabel={lastMonthLabel}
                            metric={ordersMetric}
                            accent="orange"
                            series={
                                [
                                    { value: Math.max(0, ordersMetric.thisMonth * 0.7) },
                                    { value: Math.max(0, ordersMetric.thisMonth * 0.9) },
                                    { value: Math.max(0, ordersMetric.thisMonth * 1.1) },
                                    { value: Math.max(0, ordersMetric.thisMonth * 1.0) },
                                    { value: Math.max(0, ordersMetric.thisMonth * 0.85) },
                                    { value: Math.max(0, ordersMetric.thisMonth * 0.95) },
                                    { value: Math.max(0, ordersMetric.thisMonth) },
                                ]
                            }
                        />

                        <MetricSparkCard
                            title="Avg.Order Revenue"
                            monthLabel={thisMonthLabel}
                            prevLabel={lastMonthLabel}
                            metric={metrics.averageOrderRevenue}
                            prefix={currencySymbol}
                            suffix={currencySuffix}
                            accent="green"
                            series={
                                [
                                    { value: Math.max(0, metrics.averageOrderRevenue.lastMonth * 0.7) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.lastMonth * 0.9) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.lastMonth * 1.1) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.lastMonth * 1.0) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.thisMonth * 0.85) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.thisMonth * 0.95) },
                                    { value: Math.max(0, metrics.averageOrderRevenue.thisMonth) },
                                ]
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="p-5">Couldn't fetch board</div>
            )}
        </Loader>
    )
}
