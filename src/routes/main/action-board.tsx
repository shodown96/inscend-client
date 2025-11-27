import AddCustomerIcon from "@/assets/icons/add-customers.svg?react"
import AddProductIcon from "@/assets/icons/add-products.svg?react"
import EmptyIcon from "@/assets/icons/empty.svg?react"
import RecordSaleIcon from "@/assets/icons/record-sale.svg?react"
import ActionCardItem from "@/components/custom/action-card-item"
import BrainstormDialog from "@/components/custom/brainstorm-dialog"
import DashboardCard from "@/components/custom/dashboard-card"
import { ImportModal } from "@/components/custom/import-modal"
import { ProductModal } from "@/components/custom/product-modal"
import SelectPill from "@/components/custom/select-pill"
import { Button } from "@/components/ui/button"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS, PATHS } from "@/lib/constants"
import { useActionBoardStore } from "@/lib/stores/action-board"
import { useAuthStore } from "@/lib/stores/auth"
import { useProductStore } from "@/lib/stores/product"
import type { GenerateActionCardResult } from "@/types/action-board"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"

type ViewType = 'Action card' | 'Overview'
const views: ViewType[] = [
    "Action card",
    "Overview",
]

export default function ActionBoardPage() {
    const hasRun = useRef(false)
    const { user } = useAuthStore()
    const { products, setProducts } = useProductStore()
    const { actionCardResult, setActionCardResult, setAffectedProducts } = useActionBoardStore()
    const [view, setView] = useState<ViewType>(views[0])
    const [metrics, setMetrics] = useState({
        salesTotal: "",
        orderStatuses: "",
        totalProfit: "",
        customerStats: "",
        orderStats: "",
        avgOrderRevenue: "",
        salesDistribution: ""
    })
    const navigate = useNavigate()

    const fetchData = async () => {
        const r = await mainClient.get(API_ENDPOINTS.Products.Base);
        if (r.data.result.items) {
            setProducts(r.data.result.items)
        }
    }
    const fetchMetrics = async () => {
        if (false) {
            console.log(metrics)
            setMetrics({
                salesTotal: "",
                orderStatuses: "",
                totalProfit: "",
                customerStats: "",
                orderStats: "",
                avgOrderRevenue: "",
                salesDistribution: ""
            })
        }
        // const r = await mainClient.get(API_ENDPOINTS.Analytics.ActionBoardMetrics);
        // if (r.data.result) {
        //     setMetrics(r.data.result)
        // }
    }
    const fetchActionCards = async () => {
        const cardResult = await mainClient.get(API_ENDPOINTS.Analytics.ActionCards);
        const result: GenerateActionCardResult = cardResult.data.result
        if (result.success) {
            setActionCardResult(result)
            const idList = result.cards.map(v => v.entities.product_ids).flat()
            const pResult = await mainClient.get(API_ENDPOINTS.Products.Base, {
                params: { idList }
            });
            if (pResult.data.result.items) {
                setAffectedProducts(pResult.data.result.items)
            }
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        if (!hasRun.current) {
            fetchActionCards()
            fetchMetrics()
            hasRun.current = true
        }
    }, [hasRun.current])
    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-semibold text-xl">Welcome, {user?.name.split(" ")?.[0]}</h4>
                    <p className="text-sm">Here's what's happening with your business.</p>
                </div>
                <BrainstormDialog />
            </div>
            <div className="border rounded-lg bg-white grid grid-cols-12 mb-4">
                <DashboardCard
                    title="Today’s Revenue"
                    description={0}
                    bordered
                />
                <DashboardCard
                    title="Active Customers"
                    description={0}
                    bordered
                />
                <DashboardCard
                    title="Completed Actions"
                    description={0}
                    bordered
                />
                <DashboardCard
                    title="Stock Health"
                    description={0}
                />
            </div>
            <div className="flex justify-between items-center">
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
                <ProductModal buttonText={`Add ${products.length ? '' : 'your first'} product`} />
            </div>
            <hr className="my-3" />

            {view === 'Action card' ? (
                <>
                    {actionCardResult?.total_cards ? (
                        <div className="grid grid-cols-12 gap-4 h-[60vh] overflow-auto pb-4">
                            {actionCardResult.cards.map(v => (
                                <div key={v.card_id} className="col-span-4" >
                                    <ActionCardItem item={v} />
                                </div>
                            ))}

                        </div>
                    ) : (
                        <>
                            <div className="bg-white rounded p-3 py-10 flex flex-col gap-4 justify-center items-center text-center mb-4">
                                <EmptyIcon />
                                <div>Your Action Board is empty</div>
                                <div className="w-3/5">
                                    Start by adding products to your inventory. This will show important insights, alerts, and actions to help you manage your business.
                                </div>
                                <div className="flex gap-2">
                                    <ProductModal buttonText="Add Your First Product" />
                                    <ImportModal type="Products" />
                                </div>
                            </div>
                            <div className="flex gap-2">
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
                <div className="flex justify-center items-center h-[50vh] text-lg font-medium">
                    Coming soon
                </div>
            )}
        </div>
    )
}
