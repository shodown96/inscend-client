import DashboardHeader from '@/components/custom/dashboard-header'
import DashboardSidebar from '@/components/custom/dashboard-sidebar'
import { Outlet } from 'react-router'

export default function MainLayout() {
    return (
        <div className='flex bg-[#FAFAFA] h-screen overflow-hidden'>
            <DashboardSidebar />
            <div className='flex-1'>
                <DashboardHeader />
                <div className="max-h-[calc(100vh-57px)] overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
