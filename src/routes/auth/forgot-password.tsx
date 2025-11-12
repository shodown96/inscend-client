
import EmailForm from "@/components/forms/forgot-password/email-form";
import ResetPasswordForm from "@/components/forms/forgot-password/reset-form";
import CodeVerfiyForm from "@/components/forms/forgot-password/verify-form";
import { mainClient } from "@/lib/axios";
import { APP_NAME } from "@/lib/constants";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { STRINGS } from "@/lib/constants/messages";
import { PATHS } from "@/lib/constants/paths";
import { useAuthStore } from "@/lib/stores/auth";
import {
    CodeParamsSchema,
    EmailParamsSchema,
    ResetPasswordParamsSchema,
    type CodeParamsType,
    type EmailParamsType,
    type ResetPasswordParamsType
} from "@/lib/validations/auth";
import { isAxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const { resetPasswordParams, setResetPasswordParams } = useAuthStore();

    // Send the password reset code to the user's email
    const sendResetCode = async (values: EmailParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.ForgotPassword, values);
            if (result.status === 200) {
                setResetPasswordParams(values)
                toast.success(STRINGS.PasswordResetCodeSent);
                setCurrentStep(1)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        }
    };

    // Verify the password reset code to the user's email
    const handleRemoteSubmit = async (values: ResetPasswordParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.ResetPassword, {
                email: String(resetPasswordParams.email),
                code: String(resetPasswordParams.code),
                password: values.newPassword,
            });
            if (result.status === 200) {
                toast.success(STRINGS.ResetPasswordSuccessfully);
                setResetPasswordParams({ email: "", code: "" });
                navigate(PATHS.SIGN_IN);
            } else {
                toast.error(result.data.message)
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
                email: String(resetPasswordParams.email),
                code: values.code
            })
            if (result.status === 200) {
                toast.success(STRINGS.Success);
                setResetPasswordParams({ code: values.code });
                setCurrentStep(2)
            } else {
                toast.error(result.data.message)
            }
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        } finally {
            toast.dismiss(toastId)
        }
    };

    const verifyformik = useFormik<CodeParamsType>({
        initialValues: { code: resetPasswordParams.code || "" },
        onSubmit: verifyCode,
        validateOnBlur: true,
        // validateOnMount: true
        validationSchema: CodeParamsSchema,
    });

    const resetformik = useFormik<ResetPasswordParamsType>({
        initialValues: {
            confirmPassword: "",
            newPassword: "",
        },
        onSubmit: handleRemoteSubmit,
        validateOnBlur: true,
        // validateOnMount: true
        validationSchema: ResetPasswordParamsSchema,
    });

    const emailformik = useFormik<EmailParamsType>({
        initialValues: { email: resetPasswordParams.email || "" },
        onSubmit: sendResetCode,
        validateOnBlur: true,
        // validateOnMount: true
        validationSchema: EmailParamsSchema,
    });

    return (
        <>
            <title>{`Forgot Password | ${APP_NAME}`}</title>
            <div className="flex justify-center items-center h-screen p-10">
                {currentStep === 0 ? (
                    <EmailForm formik={emailformik} />
                ) : null}
                {currentStep === 1 ? (
                    <CodeVerfiyForm formik={verifyformik} />
                ) : null}
                {currentStep === 2 ? (
                    <ResetPasswordForm formik={resetformik} />
                ) : null}
            </div>
        </>
    )
}
