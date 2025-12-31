import ShopifyLogo from "@/assets/icons/shopify-logo.svg?react"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants"
import { useIntegrationsStore } from "@/lib/stores/integrations"
import { isAxiosError } from "axios"
import { useState } from "react"
import { toast } from "sonner"
import IntegrationItem from "../custom/integration-item"
import { Button } from "../ui/button"
export default function ShopifyIntegration() {
    const [shop, setShop] = useState("")
    const [loading, setLoading] = useState(false)
    const { integrations } = useIntegrationsStore()

    const initiateAuth = async () => {
        setLoading(true)
        try {
            const res = await mainClient.get(API_ENDPOINTS.Shopify.InitiateAuth, {
                params: { shop: shop.replace("https://", "").replace("http://", "")  }
            })

            if (res.status === 200) {
                toast.success(res.data.message)
                window.location.replace(res.data.result.url)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const importShopifyData = async () => {
        setLoading(true)
        try {
            const res = await mainClient.get(API_ENDPOINTS.Shopify.Import)

            if (res.status === 200) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message)
            }
        } finally {
            setLoading(false)
        }
    }
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!shop.trim()) {
            toast.error("Shop is required")
            return
        }
        await initiateAuth()
    }

    return (
        <div className="mt-6">
            <IntegrationItem
                title="Shopify"
                integrated={integrations.shopify}
                description="Import your existing products, customers, and orders from Shopify into Inscend in minutes."
                icon={ShopifyLogo}
                dialog={{
                    title: "Shopify Integration",
                    description: "Import your existing products, customers, and orders from Shopify into Inscend in minutes.",
                    children: () => (
                        <>
                            {integrations.shopify ? (
                                <div>
                                    <Button
                                        loading={loading}
                                        onClick={importShopifyData}>
                                        Import shopify data
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-4">
                                    <div className="flex flex-col">
                                        <label className="font-medium mb-1">Shop</label>
                                        <input
                                            type="text"
                                            value={shop}
                                            disabled={loading}
                                            onChange={(e) => setShop(e.target.value)}
                                            placeholder="e.g. inscend-2.myshopify.com"
                                            className="border p-2 rounded"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        loading={loading}
                                        className="px-4 py-2 rounded bg-black text-white w-full">
                                        Connect Shopify Store
                                    </Button>
                                </form>
                            )}
                        </>
                    )
                }} />
        </div>
    )
}