
export default function ActionBoardOverview({
    monthlyMetrics,
    monthlyOverviewMetrics
}: {
    monthlyMetrics: {
        thisMonth: string | number,
        lastMonth: string | number
    }
    monthlyOverviewMetrics: {
        customersCount: string | number,
        averageOrderRevenue: string | number,
    }
}) {
    return (
        <div className="p-5">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6">
                    <div className="border bg-white rounded-lg flex flex-col justify-center items-center p-5">
                        <p className="text-lg font-semibold">This month: ${monthlyMetrics.thisMonth}</p>
                        <p>Last month: ${monthlyMetrics.lastMonth}</p>
                    </div>
                </div>

                <div className="col-span-6">
                    <div className="border bg-white rounded-lg flex flex-col justify-center items-center p-5">
                        <p className="text-lg font-semibold">Customers this month</p>
                        <p>{monthlyOverviewMetrics.customersCount}</p>
                    </div>
                </div>

                <div className="col-span-6">
                    <div className="border bg-white rounded-lg flex flex-col justify-center items-center p-5">
                        <p className="text-lg font-semibold">Avg. order revenue this month</p>
                        <p>${monthlyOverviewMetrics.averageOrderRevenue}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
