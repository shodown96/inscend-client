"use client";

import AuthCard from "../../custom/auth-card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import type { ResetPasswordParamsType } from "@/lib/validations/auth";
import type { FormikProps } from "formik";
import { Key } from "lucide-react";

interface ResetPasswordFormProps {
    formik: FormikProps<ResetPasswordParamsType>
    onPrevious?: () => void
}

export default function ResetPasswordForm({ formik, onPrevious }: ResetPasswordFormProps) {

    const {
        handleChange,
        handleBlur,
        handleSubmit,
        errors,
        touched,
        values,
        isSubmitting,
    } = formik;

    return (
        <AuthCard
            title="Create new password"
            goBack={onPrevious}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Input
                    type="password"
                    id="newPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.newPassword}
                    error={errors.newPassword}
                    touched={touched.newPassword}
                    placeholder={"Enter your new password"}
                    leftIcon={Key}
                />
                <Input
                    type="password"
                    id="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    error={errors.confirmPassword}
                    touched={touched.confirmPassword}
                    placeholder={"Confirm your new password"}
                    leftIcon={Key}
                />
                <Button type="submit" size={"lg"} loading={isSubmitting}>
                    Reset Password
                </Button>
            </form>
        </AuthCard>
    );
}
