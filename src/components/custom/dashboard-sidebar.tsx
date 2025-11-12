import AnalyticsIcon from "@/assets/icons/sidebar/analytics.svg?react";
import CustomerIcon from "@/assets/icons/sidebar/customer.svg?react";
import DashboardIcon from "@/assets/icons/sidebar/dashboard.svg?react";
import InventoryIcon from "@/assets/icons/sidebar/inventory.svg?react";
import SalesIcon from "@/assets/icons/sidebar/sales.svg?react";
import SettingsIcon from "@/assets/icons/sidebar/settings.svg?react";
import { PATHS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import { cn, getInitials, getLimitedText } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import Logo from "./logo";

export default function DashboardSidebar({ }) {
    const { user, signOut } = useAuthStore()
    // const os = getOS()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const routes = [
        { name: "Dashboard", path: PATHS.DASHBOARD, icon: DashboardIcon },
        { name: "Inventory", path: PATHS.INVENTORY, icon: InventoryIcon },
        { name: "Sales", path: PATHS.SALES, icon: SalesIcon },
        { name: "Customers", path: PATHS.CUSTOMERS, icon: CustomerIcon },
        { name: "Analytics", path: PATHS.ANALYTICS, icon: AnalyticsIcon },
        { name: "Settings", path: PATHS.SETTINGS, icon: SettingsIcon },
    ]
    return (
        <div className="bg-white lg:w-[270px] h-screen border px-2 py-4 flex flex-col justify-between">
            <div>
                <Logo />
                {/* <div className="bg-[#FAFAFA] rounded-lg flex gap-2 items-center my-4 px-4 py-2">
                    <Search className="" />
                    <input type="text" className="outline-none w-full" />
                    <span className="shadow p-1 rounded flex items-center bg-[#FAFAFA]">{os === 'mac' ? <Command className="size-4" /> : 'Ctrl'} <span>F</span></span>
                </div> */}

                <div className="flex flex-col gap-4 mt-4">
                    {routes.map(v => (
                        <div key={v.path}
                            onClick={() => navigate(v.path)}
                            className={cn(
                                "rounded-lg flex gap-4 items-center px-4 py-2 transition-all cursor-pointer",
                                pathname.includes(v.path) ? 'border bg-[#FAFAFA]' : ''
                            )}>
                            <v.icon />
                            <span className="">{v.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 items-center">
                {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="size-8 rounded-full" />
                ) : (
                    <div className="bg-primary text-white rounded-full size-8 flex justify-center items-center text-sm" onClick={signOut}>
                        {getInitials(user?.name)}
                    </div>
                )}
                <div className="text-sm flex-1">
                    <p>{user?.name}</p>
                    <p className="text-gray-400">{getLimitedText(`${user?.email}`, 20)}</p>
                </div>
                <LogOut onClick={signOut} className="text-gray-600 size-5 cursor-pointer" />
            </div>

        </div>
    )
}
