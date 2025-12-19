import DashboardHeader from '@/components/custom/dashboard-header'
import DashboardSidebar from '@/components/custom/dashboard-sidebar'
import CustomTourProvider from '@/components/custom/tour/tour-provider'
import { Outlet } from 'react-router'

export default function MainLayout() {
    return (
        <CustomTourProvider>
            <div className='flex bg-[#FAFAFA] h-screen overflow-hidden'>
                <DashboardSidebar />
                <div className='flex-1'>
                    <DashboardHeader />
                    <div className="max-h-[calc(100vh-57px)] overflow-auto lg:max-w-[calc(100vw-270px)] max-w-[calc(100vw-60px)]">
                        <Outlet />
                    </div>
                </div>
            </div>
        </CustomTourProvider>
    )
}
