import Logo from "@/components/custom/logo";
import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <div className="bg-primary py-5 p-3 flex justify-center">
                <Logo colored />
            </div>
            <Outlet />
        </div>
    )
}
