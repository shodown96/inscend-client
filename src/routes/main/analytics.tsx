import BrainstormDialog from "@/components/custom/brainstorm-dialog";
import Loader from "@/components/custom/loader";
import { ProductModal } from "@/components/custom/product-modal";
import { BusinessInsightsView } from "@/components/views/business-analytics-view";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants";
import type { BusinessAnalyticsResult, IssueResult } from "@/types/analytics";
import { useEffect, useRef, useState } from "react";

// const views = [
//     "Today",
//     "Last 7 Days ",
//     "Last 30 days ",
//     "This Quater",
// ]
export default function AnalyticsPage() {
    // const [view, setView] = useState(views[0])

    const handleAskBrainstorm = () => {
        console.log('Ask Brainstorm clicked');
        alert('Opening Brainstorm assistant...');
    };

    const handleViewFullReport = () => {
        console.log('View Full Report clicked');
        alert('Opening full business health report...');
    };

    const initHasRun = useRef(false)
    const [loading, setLoading] = useState(false)
    const [issueResult, setIssueResult] = useState<IssueResult | null>(null)
    const [analyticsResult, setAnalyticsResult] = useState<BusinessAnalyticsResult | null>(null)

    const fetchIssues = async () => {
        console.log("Fetching GetBusinessIssues")
        const r = await mainClient.get(API_ENDPOINTS.Analytics.GetBusinessIssues);
        if (r.data.result) {
            setIssueResult(r.data.result)
        }
    }

    const fetchAnalytics = async () => {
        console.log("Fetching GetBusinessAnalytics")
        const r = await mainClient.get(API_ENDPOINTS.Analytics.GetBusinessAnalytics);
        if (r.data.result) {
            setAnalyticsResult(r.data.result)
        }
    }
    const init = async () => {
        setLoading(true)
        await fetchIssues()
        await fetchAnalytics()
        initHasRun.current = true
        setLoading(false)
    }

    useEffect(() => {
        if (!initHasRun.current && !loading) {
            init()
        }
    }, [initHasRun.current])
    return (
        <Loader loading={loading}>
            <div className="p-10">
                <title>{`Analytics | ${APP_NAME}`}</title>
                <div className="flex justify-between md:items-center mb-4 gap-4 max-md:flex-col">
                    <div>
                        <h4 className="font-semibold text-xl">Business Health Check</h4>
                        <p className="text-sm">Here's what's happening with your business.</p>
                    </div>
                    <div className="flex gap-2">
                        <ProductModal />
                        <BrainstormDialog outlined />
                    </div>
                </div>
                {/* <div className="flex items-center w-max border rounded-lg overflow-hidden mb-4">
                    {views.map(item => (
                        <SelectPill
                            key={item}
                            label={item}
                            active={item === view}
                            onSelect={() => setView(item)}
                        />
                    ))}
                </div> */}
                {/* <BusinessHealthStatus
                    healthScore={75}
                    issuesCount={2}
                    opportunitiesCount={3}
                    onAskBrainstorm={handleAskBrainstorm}
                    onViewFullReport={handleViewFullReport}
                /> */}

                {issueResult?.generatedAt && analyticsResult?.generatedAt ? (
                    <BusinessInsightsView
                        analytics={analyticsResult}
                        issues={issueResult}
                        onAskBrainstorm={handleAskBrainstorm}
                        onViewFullReport={handleViewFullReport}
                    />
                ) : null}
            </div>
        </Loader>
    )
}
// import PlaceholderPage from '@/components/custom/placeholder-page'

// export default function AnalyticsPage() {
//     return (
//         <PlaceholderPage title='Analytics Page' />
//     )
// }
