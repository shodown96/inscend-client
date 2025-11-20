import Loader from "@/components/custom/loader";
import { mainClient } from "@/lib/axios";
import { APP_NAME } from "@/lib/constants";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { PATHS } from "@/lib/constants/paths";
import { useAuthStore } from "@/lib/stores/auth";
import type { APIResponse } from "@/types";
import type { SignInResult } from "@/types/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function SSOCallbackPage() {

    const hasRun = useRef(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    const oauthError = searchParams.get('error');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { setAuth } = useAuthStore()


    const fetchTokens = async () => {
        try {
            if (!code) {
                // sso-callback?error=access_denied
                if (oauthError) {
                    if (oauthError === "access_denied") {
                        toast.error("Your Access was denied")
                        setError("Your Access was denied.");
                    }
                } else {
                    setError("Authentication code wasn't provided.");
                }
                setLoading(false);
                return;
            }
            const res = await mainClient.post(API_ENDPOINTS.Auth.GoogleSignIn, { code: decodeURIComponent(code) });
            if (res.status === 200) {
                const data = res.data as APIResponse<SignInResult>
                console.log(data)
                toast.success(data.message)
                setAuth(data.result)
                if (!data.result.user.businessId) {
                    navigate(PATHS.SETUP_BUSINESS);
                    return
                }
                navigate(PATHS.ACTION_BOARD);
            }
        } catch (err: any) {
            if (err?.response?.data.message) {
                toast.error(err.response?.data.message);
                setError(err.response?.data.message);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        fetchTokens();
    }, [code]);

    return (
        <Loader loading={loading} text="Authenticating with Google...">
            <title>{`SSO Callback | ${APP_NAME}`}</title>
            <div className="flex justify-center items-center h-screen">
                {error.length ? (
                    <p>Error: {error}</p>
                ) : null}
            </div>
        </Loader>
    )
}
