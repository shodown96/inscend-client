"use client";

import { mainClient } from "@/lib/axios";
import { OTP_COUNTDOWN_TIME, OTP_LENGTH } from "@/lib/constants";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { STRINGS } from "@/lib/constants/messages";
import { cn, formatSeconds } from "@/lib/utils";
import { type CodeParamsType } from "@/lib/validations/auth";
import { isAxiosError } from "axios";
import { type FormikProps } from "formik";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AuthCard from "../../custom/auth-card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";

export default function SignupVerfiyForm({
    email,
    formik,
    onPrevious,
}: {
    email: string,
    onPrevious?:()=>void
    formik: FormikProps<CodeParamsType>,
}) {
    const [countdown, setCountdown] = useState(OTP_COUNTDOWN_TIME);
    const [isResendEnabled, setIsResendEnabled] = useState(false);

    const sendResetCode = async () => {
        const toastId = toast.loading("Resending code")
        try {
            const result = await mainClient.post(API_ENDPOINTS.Auth.SendCode, { email });
            if (result.status === 200) {
                toast.success(STRINGS.PasswordResetCodeSent);
            }
        } catch (error) {
            formik.setFieldError("code", "")
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            }
        } finally {
            toast.dismiss(toastId)
        }
    };

    const handleResendOTP = async () => {
        setCountdown(OTP_COUNTDOWN_TIME);
        setIsResendEnabled(false);
        sendResetCode()

    }

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsResendEnabled(true);
        }
    }, [countdown]);


    const {
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting
    } = formik;

    return (

        <AuthCard
            title="Two-factor Authentication"
            description="We have sent a code to your email"
            goBack={onPrevious}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="text-xs font-medium w-full text-left mb-12 uppercase">VERIFICATION CODE</label>
                    <InputOTP
                        containerClassName={"justify-between"}
                        id="code"
                        maxLength={OTP_LENGTH}
                        onBlur={handleBlur("code")}
                        onChange={handleChange("code")}
                        value={values.code}
                        disabled={isSubmitting}
                    >
                        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                            <InputOTPGroup key={index}>
                                <InputOTPSlot
                                    index={index}
                                    className={cn(
                                        values.code.length === OTP_LENGTH ? "border-success" : "",
                                        touched.code && errors.code ? "border-error!" : "",
                                        "data-[active=true]:outline-none data-[active=true]:ring-0 data-[active=true]:ring-primary data-[active=true]:border-primary",
                                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

                                    )} />
                            </InputOTPGroup>
                        ))}
                    </InputOTP>
                    {touched.code && errors.code && (
                        <label className={"text-xs mt-1 text-error"}>{errors.code}</label>
                    )}

                </div>
                <Button type="submit" size={"lg"} loading={isSubmitting}>
                    Verify OTP
                </Button>
                <div className="flex gap-2 text-sm justify-center">
                    <p>Didn't recieve a code? <span
                        onClick={handleResendOTP}
                        className={cn(
                            "font-semibold",
                            isResendEnabled ? "text-primary cursor-pointer" : "text-gray-400",

                        )}>{isResendEnabled ? 'Resend' : formatSeconds(countdown)}</span></p>
                </div>
            </form>
        </AuthCard>
    )
}