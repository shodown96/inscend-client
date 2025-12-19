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
import { Link, useLocation, useNavigate } from "react-router";
import Logo from "./logo";

export default function DashboardSidebar({ }) {
    const { user, signOut } = useAuthStore()
    // const os = getOS()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const routes = [
        { name: "Action Board", path: PATHS.ACTION_BOARD, icon: DashboardIcon, id: "sidebar-action-board" },
        { name: "Inventory", path: PATHS.INVENTORY, icon: InventoryIcon, id: "sidebar-products" },
        { name: "Sales", path: PATHS.SALES, icon: SalesIcon, id: "sidebar-sales" },
        { name: "Customers", path: PATHS.CUSTOMERS, icon: CustomerIcon, id: "sidebar-customers" },
        { name: "Analytics", path: PATHS.ANALYTICS, icon: AnalyticsIcon, id: "sidebar-analytics" },
        { name: "Settings", path: PATHS.SETTINGS, icon: SettingsIcon, id: "sidebar-settings" },
    ]
    return (
        <div className="bg-white w-[60px] lg:w-[270px] h-screen border px-2 py-4 flex flex-col justify-between">
            <div>
                <div id="sidebar-welcome">
                    <div className="max-lg:hidden"><Logo /></div>
                    <Link to={"/"}><img src="/logo.png" className="lg:hidden size-8 mx-auto" /></Link>
                </div>

                <div className="flex flex-col gap-4 mt-4 max-lg:items-center">
                    {routes.map(v => (
                        <div key={v.id}
                            id={v.id}
                            onClick={() => navigate(v.path)}
                            className={cn(
                                "rounded-lg flex gap-4 items-center p-2 lg:px-4 lg:py-2 transition-all cursor-pointer border border-transparent",
                                pathname.includes(v.path) ? 'border-gray-200 bg-[#FAFAFA]' : ''
                            )}>
                            <v.icon className="" />
                            <span className="max-lg:hidden">{v.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 items-center max-lg:flex-col">
                {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt="" className="size-8 rounded-full" />
                ) : (
                    <div className="bg-primary text-white rounded-full size-8 flex justify-center items-center text-sm" onClick={signOut}>
                        {getInitials(user?.name)}
                    </div>
                )}
                <div className="text-sm flex-1 max-lg:hidden">
                    <p>{user?.name}</p>
                    <p className="text-gray-400">{getLimitedText(`${user?.email}`, 20)}</p>
                </div>
                <LogOut
                    id="sidebar-signout"
                    onClick={signOut}
                    className="text-gray-600 size-5 cursor-pointer" />
            </div>

        </div>
    )
}
