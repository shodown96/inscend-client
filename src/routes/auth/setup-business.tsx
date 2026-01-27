import SetupBusinessForm from "@/components/forms/setup-business-form";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME, PATHS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import type { SetupBusinessParamsType } from "@/lib/validations/auth";
import type { Business } from "@/types/auth";
import { isAxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function SetupBusinessPage() {
    const navigate = useNavigate()
    const { user, setUser } = useAuthStore()
    const [searchParams] = useSearchParams()

    const handleFormSubmit = async (values: SetupBusinessParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Business.Base, values);
            if (result.status === 200) {
                const business = result.data.result as Business
                toast.success("Success");
                if (user) {
                    setUser({ ...user, businessId: business.id, business });
                }
                const PATH = searchParams.get("nextURL") || PATHS.ONBOARDING
                navigate(PATH);
            } else {
                toast.error(result.data.message)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        }
    };
    return (
        <div className="flex pt-32 justify-center">
            <title>{`Setup Business | ${APP_NAME}`}</title>
            <SetupBusinessForm onFormSubmit={handleFormSubmit} />
        </div>
    )
}
