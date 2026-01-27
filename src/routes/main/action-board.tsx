import AddCustomerIcon from "@/assets/icons/add-customers.svg?react"
import AddProductIcon from "@/assets/icons/add-products.svg?react"
import EmptyIcon from "@/assets/icons/empty.svg?react"
import RecordSaleIcon from "@/assets/icons/record-sale.svg?react"
import ActionCardItem from "@/components/custom/action-card-item"
import BrainstormDialog from "@/components/custom/brainstorm-dialog"
import DashboardCard from "@/components/custom/dashboard-card"
import { ImportModal } from "@/components/custom/import-modal"
import Loader from "@/components/custom/loader"
import { ProductModal } from "@/components/custom/product-modal"
import SelectPill from "@/components/custom/select-pill"
import { Button } from "@/components/ui/button"
import ActionBoardOverview from "@/components/views/action-board-overview"
import useAppTour from "@/hooks/use-app-tour"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS, APP_NAME, PATHS } from "@/lib/constants"
import { useActionBoardStore } from "@/lib/stores/action-board"
import { useAuthStore } from "@/lib/stores/auth"
import { useBusinessDataStore, type BusinessData } from "@/lib/stores/business"
import { useChecklistStore } from "@/lib/stores/checklist"
import { useProductStore } from "@/lib/stores/product"
import type { GenerateActionCardResult } from "@/types/action-board"
import { ArrowRight, RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

type ViewType = 'Action card' | 'Overview'
const views: ViewType[] = [
    "Action card",
    "Overview",
]

export default function ActionBoardPage() {
    const initHasRun = useRef(false)
    const [loading, setLoading] = useState(false)
    const { user } = useAuthStore()
    const { isChecklistMinimized } = useChecklistStore()
    const { products, setProducts } = useProductStore()
    const { businessData, setBusinessData } = useBusinessDataStore()
    const { actionCardResult, setActionCardResult, setAffectedProducts } = useActionBoardStore()
    const [view, setView] = useState<ViewType>(views[0])
    const [metrics, setMetrics] = useState({
        todaysRevenue: "0",
        activeCustomers: "0",
        stockHealth: "0",
    })

    const navigate = useNavigate()
    useAppTour('overview', !loading && isChecklistMinimized)

    const fetchProducts = async () => {
        console.log("Fetching Products")
        const r = await mainClient.get(API_ENDPOINTS.Products.Base);
        if (r.data.result.items) {
            setProducts(r.data.result.items)
        }
    }

    const fetchMetrics = async () => {
        console.log("Fetching Metrics")
        const r = await mainClient.get(API_ENDPOINTS.Analytics.ActionBoardMetricCards);
        if (r.data.result) {
            setMetrics(r.data.result)
        }
    }

    const getFullBusinessData = async () => {
        setLoading(true)
        console.log("Fetching Full Business Data")
        const result = await mainClient.get(API_ENDPOINTS.Business.MyFullData)
        console.log(result.data.result)
        if (result.data.status === 'success') {
            const data = result.data.result as BusinessData
            if (!data.products.length) {
                setLoading(false)
                return;
            }
            setBusinessData(data)
            await fetchActionCards(data)
        }
    }

    const fetchActionCards = async (businessData: BusinessData) => {
        if (!businessData?.products.length) {
            return
        }
        console.log("Fetching Action Cards")
        toast.info("Fetching Action Cards")
        try {
            const cardResult = await mainClient.post(API_ENDPOINTS.Analytics.GenerateActionCards, {
                ...businessData,
                "max_cards": 6,
                "time_range": "week"
            });
            const result: GenerateActionCardResult = cardResult.data
            if (result.success) {
                setActionCardResult(result)
                fetchAffectedProducts(result)
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchAffectedProducts = async (actionCardResult: GenerateActionCardResult) => {
        if (actionCardResult?.success) {
            console.log("Fetching Affected Products")
            const idList = actionCardResult.cards.map(v => v.entities.product_ids).flat()
            const pResult = await mainClient.get(API_ENDPOINTS.Products.Base, {
                params: { idList }
            });
            if (pResult.data.result.items) {
                setAffectedProducts(pResult.data.result.items)
            }
        }
    }

    const fetchSalesByCountry = async () => {
        console.log("Fetching SalesByCountry")
        const r = await mainClient.get(API_ENDPOINTS.Analytics.GetSalesByCountry);
        if (r.data.result) {
            // setMetrics(r.data.result)
            console.log(r.data.result)
        }
    }

    const init = async () => {
        await fetchProducts()
        await fetchMetrics()
        fetchSalesByCountry()
        if (!businessData) {
            await getFullBusinessData()
        }
        initHasRun.current = true
    }

    useEffect(() => {
        if (!initHasRun.current) {
            init()
        }
    }, [initHasRun.current])

    return (
        <Loader loading={loading} className="w-full">
            <title>{`Action Board | ${APP_NAME}`}</title>
            <div className="p-5 md:p-10">
                <div className="flex justify-between md:items-center mb-4 max-md:flex-col gap-4">
                    <div>
                        <h4 className="font-semibold text-xl">Welcome, {user?.name.split(" ")?.[0]}</h4>
                        <p className="text-sm">Here's what's happening with your business.</p>
                    </div>
                    <BrainstormDialog />
                </div>
                <div className="border rounded-lg bg-white grid grid-cols-12 mb-4">
                    <DashboardCard
                        title="Today’s Revenue"
                        description={metrics.todaysRevenue}
                        bordered
                        className="col-span-4"
                    />
                    <DashboardCard
                        title="Active Customers"
                        description={metrics.activeCustomers}
                        bordered
                        className="col-span-4"
                    />
                    {/* <DashboardCard
                        title="Completed Actions"
                        description={0}
                        bordered
                    /> */}
                    <DashboardCard
                        title="Stock Health"
                        description={`${metrics.stockHealth || 0}%`}
                        className="col-span-4"
                    />
                </div>
                <div className="flex justify-between md:items-center max-md:flex-col gap-4">
                    <div className="flex items-center w-max border rounded-lg overflow-hidden">
                        {views.map(item => (
                            <SelectPill
                                key={item}
                                label={item}
                                active={item === view}
                                onSelect={() => setView(item)}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <ProductModal buttonText={`Add ${products.length ? '' : 'your first'} product`} />
                        <Button onClick={getFullBusinessData} className="w-max"><RefreshCw />
                            Refresh cards
                        </Button>
                    </div>
                </div>
                <hr className="my-3" />

                <div id="sidebar-action-cards">
                    {view === 'Action card' ? (
                        <>
                            {actionCardResult?.total_cards ? (
                                <>
                                    <div className="max-md:hidden grid grid-cols-12 gap-4 h-[60vh]-overflow-auto pb-4">
                                        {actionCardResult.cards.map(v => (
                                            <div key={v.card_id} className="col-span-12 md:col-span-6 xl:col-span-4" >
                                                <ActionCardItem item={v} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="md:hidden flex gap-4 overflow-x-scroll pb-4">
                                    {actionCardResult.cards.map(v => (
                                        <div key={v.card_id} className="w-[300px]!" >
                                            <ActionCardItem item={v} />
                                        </div>
                                    ))}
                                </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                                        <EmptyIcon />
                                        <div>Your Action Board is empty</div>
                                        <div className="md:w-3/5">
                                            Start by adding products to your inventory. This will show important insights, alerts, and actions to help you manage your business.
                                        </div>
                                        <div className="flex gap-2 max-md:flex-col">
                                            <ProductModal buttonText="Add Your First Product" />
                                            <ImportModal type="Products" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <div className="rounded border p-4 flex flex-col gap-3 bg-white">
                                            <AddProductIcon />
                                            <div className="font-medium">Add Products</div>
                                            <p className="text-sm">Start building your inventory by adding your first products.</p>
                                            <Button variant={'ghost'} className="w-max" onClick={() => navigate(PATHS.INVENTORY)}>
                                                <span>Get started</span>
                                                <ArrowRight className="-ml-1" />
                                            </Button>
                                        </div>
                                        <div className="rounded border p-4 flex flex-col gap-3 bg-white" >
                                            <AddCustomerIcon />
                                            <div className="font-medium">Add Customers</div>
                                            <p className="text-sm">Keep track of your customers and their purchase history.</p>
                                            <Button variant={'ghost'} className="w-max" onClick={() => navigate(PATHS.CUSTOMERS)}>
                                                <span>Get started</span>
                                                <ArrowRight className="-ml-1" />
                                            </Button>
                                        </div>
                                        <div className="rounded border p-4 flex flex-col gap-3 bg-white">
                                            <RecordSaleIcon />
                                            <div className="font-medium">Record a Sale</div>
                                            <p className="text-sm">Log your first sale and start tracking your revenue.</p>
                                            <Button variant={'ghost'} className="w-max" onClick={() => navigate(PATHS.SALES)}>
                                                <span>Get started</span>
                                                <ArrowRight className="-ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <ActionBoardOverview />
                    )}
                </div>
            </div>
        </Loader>
    )
}
