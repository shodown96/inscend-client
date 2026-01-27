import SignupForm from "@/components/forms/signup/signup-form";
import SignupVerfiyForm from "@/components/forms/signup/verify-form";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS, APP_NAME, PATHS, STRINGS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import { CodeParamsSchema, SignUpParamsSchema, type CodeParamsType, type SignUpParamsType } from "@/lib/validations/auth";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function SignUpPage() {
    const navigate = useNavigate()
    const { setUser, setTokens } = useAuthStore()
    const [currentStep, setCurrentStep] = useState(0)
    const [searchParams] = useSearchParams();

    const handleRegistration = async () => {
        try {
            const { confirmPassword, ...rest } = signupFormik.values
            const result = await mainClient.post(API_ENDPOINTS.Auth.SignUp, {
                ...rest,
                ...codeFormik.values,
            });
            if (result.status === 201) {
                toast.success(STRINGS.Success);
                const user = result.data.result.user
                const accessToken = result.data.result.accessToken
                setUser(user)
                setTokens({ accessToken })
                const nextURL = searchParams.get("nextURL")
                if (nextURL) {
                    navigate(`${PATHS.SETUP_BUSINESS}?nextURL=${searchParams.get("nextURL") || ""}`);
                } else {
                    navigate(PATHS.SETUP_BUSINESS);
                }
            } else {
                toast.error(result.data.message)
            }
        } catch (err: any) {

        }
    };

    const checkEmail = async (values: SignUpParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.CheckEmail, { email: values.email });
            if (result.status === 200) {
                sendVerificationCode(values)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        }
    };

    const sendVerificationCode = async (values: SignUpParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.SendCode, { email: values.email });
            if (result.status === 200) {
                toast.success("An OTP has been sent to your email for verification.");
                setCurrentStep(1)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        }
    };

    // Verify the password reset code to the user's email
    const verifyCode = async (values: CodeParamsType) => {
        const toastId = toast.loading("Verifying code")
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.VerifyCode, {
                email: signupFormik.values.email,
                code: values.code
            })
            if (result.status === 200) {
                toast.success(STRINGS.Success);
                codeFormik.setSubmitting(true)
                setTimeout(() => {
                    handleRegistration()
                }, 2000);
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        } finally {
            toast.dismiss(toastId)
        }
    };

    const signupFormik = useFormik<SignUpParamsType>({
        initialValues: {
            email: "",
            // name: "",
            password: "",
            confirmPassword: ""
        },
        onSubmit: checkEmail,
        validateOnBlur: true,
        // validateOnMount: true
        validationSchema: SignUpParamsSchema,
    });

    const codeFormik = useFormik<CodeParamsType>({
        initialValues: { code: "" },
        onSubmit: verifyCode,
        validateOnBlur: true,
        // validateOnMount: true
        validationSchema: CodeParamsSchema,
    });
    return (
        <div className="flex pt-32 justify-center">
            <title>{`Sign up | ${APP_NAME}`}</title>
            {currentStep === 0 ? (
                <SignupForm formik={signupFormik} />
            ) : null}
            {currentStep === 1 ? (
                <SignupVerfiyForm
                    formik={codeFormik}
                    email={signupFormik.values.email}
                    onPrevious={() => setCurrentStep(currentStep - 1)} />
            ) : null}
        </div>
    )
}
