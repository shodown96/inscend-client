import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants"
import { useIntegrationsStore } from "@/lib/stores/integrations"
import { isAxiosError } from "axios"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"
import ShopifyIntegration from "./shopify-integration"
import Loader from "../custom/loader"

export default function Integrations() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(true)
    const integratedShopify = searchParams.get("integratedShopify")
    const { integrations, setIntegrations } = useIntegrationsStore()

    const verifyShopifyIntegration = async () => {
        if (integrations.shopify) {
            setLoading(false)
            return
        };
        try {
            const res = await mainClient.get(API_ENDPOINTS.Shopify.VerfiySession)

            if (res.status === 200) {
                if (res.data.result.integrated) {
                    setIntegrations({ shopify: true })
                    // toast.success(res.data.message)
                }
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

    useEffect(() => {
        if (integratedShopify === 'true') {
            toast.success("Shopify Integrated")
            setIntegrations({ shopify: true })
            setSearchParams({ tab: 'integrations' })
            setLoading(false)
        } else {
            verifyShopifyIntegration()
        }
    }, [integratedShopify])

    return (
        <Loader loading={loading} className="h-[60vh]">
            <div className="mb-4">
                <h4 className="text-xl font-semibold">Integrations</h4>
                <p>Connect your favorite tools — from payments to marketing — and keep your store running smoothly.</p>
            </div>
            <h4 className="text-xl font-semibold mb-4">Store Platforms</h4>
            <ShopifyIntegration />
        </Loader>
    )
}