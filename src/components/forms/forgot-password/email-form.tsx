"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/constants";
import { type EmailParamsType } from "@/lib/validations/auth";
import { type FormikProps } from "formik";
import { Mail } from "lucide-react";
import { Link } from "react-router";
import AuthCard from "../../custom/auth-card";

interface EmailFormProps {
    formik: FormikProps<EmailParamsType>
}
export default function EmailForm({ formik }: EmailFormProps) {
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
            title="Forgot Password?"
            description="Leave your email and we would send to your mail">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    id="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    placeholder={"Enter your email"}
                    rightIcon={Mail}
                />
                <Button type="submit" size={"lg"} loading={isSubmitting}>
                    Continue
                </Button>
            </form>
            <div className="text-center mt-2">
                <Link to={PATHS.SIGN_IN}
                    className="text-xs text-primary hover:underline">
                    Back to sign in
                </Link>
            </div>
        </AuthCard>
    );
}
