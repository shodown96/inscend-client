// import BrainstormDialog from "@/components/custom/brainstorm-dialog";
// import { BusinessHealthStatus } from "@/components/custom/business-health";
// import { ProductModal } from "@/components/custom/product-modal";
// import SelectPill from "@/components/custom/select-pill";
// import { useState } from "react";

// const views = [
//     "Today",
//     "Last 7 Days ",
//     "Last 30 days ",
//     "This Quater",
// ]
// export default function AnalyticsPage() {
//     const [view, setView] = useState(views[0])

//     const handleAskBrainstorm = () => {
//         console.log('Ask Brainstorm clicked');
//         alert('Opening Brainstorm assistant...');
//     };

//     const handleViewFullReport = () => {
//         console.log('View Full Report clicked');
//         alert('Opening full business health report...');
//     };
//     return (
//         <div className="p-10">
//              <title>{`Analytics | ${APP_NAME}`}</title>
//             <div className="flex justify-between items-center mb-4">
//                 <div>
//                     <h4 className="font-semibold text-xl">Business Health Check</h4>
//                     <p className="text-sm">Here's what's happening with your business.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <ProductModal />
//                     <BrainstormDialog outlined />
//                 </div>
//             </div>
//             <div className="flex items-center w-max border rounded-lg overflow-hidden mb-4">
//                 {views.map(item => (
//                     <SelectPill
//                         label={item}
//                         active={item === view}
//                         onSelect={() => setView(item)}
//                     />
//                 ))}
//             </div>
//             <BusinessHealthStatus
//                 healthScore={75}
//                 issuesCount={2}
//                 opportunitiesCount={3}
//                 onAskBrainstorm={handleAskBrainstorm}
//                 onViewFullReport={handleViewFullReport}
//             />
//         </div>
//     )
// }
import PlaceholderPage from '@/components/custom/placeholder-page'

export default function AnalyticsPage() {
    return (
        <PlaceholderPage title='Analytics Page' />
    )
}
