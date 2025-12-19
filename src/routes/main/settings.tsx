import SettingPill from "@/components/custom/settings-pill"
import ProfileForm from "@/components/forms/profile-form"
import Integrations from "@/components/views/integrations"
import TeamManagement from "@/components/views/team-management"
import useAppTour from "@/hooks/use-app-tour"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS, APP_NAME } from "@/lib/constants"
import { useAuthStore } from "@/lib/stores/auth"
import type { ProfileParamsType } from "@/lib/validations/auth"
import type { User } from "@/types/auth"
import { isAxiosError } from "axios"
import { useEffect } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"

const tabs = {
    profile: "Profile",
    // billing: "Billing & Payments",
    // notifications: "Notifications",
    integrations: "Integrations",
    team: "Team & Access",
    // shopPreferences: "Shop Preferences",
    // integrations: "Integrations",
}


type TabKey = keyof typeof tabs
const tabList = Object.keys(tabs) as TabKey[]

export default function SettingsPage() {
    const { setUser } = useAuthStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") as TabKey | null
    useAppTour('settings')
    const handleFormSubmit = async (values: ProfileParamsType) => {
        try {
            const result = await mainClient.put(API_ENDPOINTS.Users.Profile, values);
            if (result.status === 200) {
                const user = result.data.result.user as User
                toast.success(result.data.message);
                setUser(user);
            } else {
                toast.error(result.data.message)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        }
    };
    useEffect(() => {
        if (!activeTab) {
            setSearchParams({ tab: tabList[0] })
        }
    }, [activeTab])
    return (
        <div className="p-5 md:p-10" id="settings-welcome">
            <title>{`Settings | ${APP_NAME}`}</title>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h4 className="font-semibold text-xl">Settings</h4>
                    <p className="text-sm">Take a look at your policies and the new policy to see what is covered</p>
                </div>
            </div>

            <div className="flex items-center w-max border rounded-lg overflow-hidden mb-4">
                {tabList.map((item) => (
                    <SettingPill
                        id={`settings-${item}`}
                        key={item}
                        label={tabs[item]}
                        active={item === activeTab}
                        onSelect={() => setSearchParams({ tab: item })}
                    />
                ))}
            </div>

            <div>
                {activeTab === 'profile' ? (
                    <ProfileForm onFormSubmit={handleFormSubmit} />
                ) : null}
                {activeTab === 'team' ? (
                    <TeamManagement />
                ) : null}
                {activeTab === 'integrations' ? (
                    <Integrations />
                ) : null}
            </div>
        </div>
    )
}
