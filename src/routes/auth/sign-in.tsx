import SignInForm from "@/components/forms/signin-form";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME, PATHS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import type { SignInParamsType } from "@/lib/validations/auth";
import type { User } from "@/types/auth";
import { isAxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function SignInPage() {
  const navigate = useNavigate()
  const { setUser, setTokens } = useAuthStore()
  const [searchParams] = useSearchParams()

  const handleFormSubmit = async (values: SignInParamsType) => {
    try {
      const result = await mainClient.post(API_ENDPOINTS.Auth.SignIn, values);
      if (result.status === 200) {
        const user = result.data.result.user as User
        toast.success(`Welcome ${user.name} `);
        setUser(user);
        setTokens({
          accessToken: result.data.result.accessToken
        });
        const PATH = searchParams.get("nextURL") || PATHS.DASHBOARD
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
      <title>{`Sign in | ${APP_NAME}`}</title>
      <SignInForm onFormSubmit={handleFormSubmit} />
    </div>
  )
}
