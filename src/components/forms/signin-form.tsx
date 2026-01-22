import { ERROR_MESSAGES, PATHS } from "@/lib/constants";
import { useAuthStore } from "@/lib/stores/auth";
import { SignInParamsSchema, type SignInParamsType } from "@/lib/validations/auth";
import { useFormik } from "formik";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import AuthCard from "../custom/auth-card";
import AuthDivider from "../custom/auth-divider";
import { GoogleSignInButton } from "../custom/google-signin-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignInFormProps {
    onFormSubmit: (values: SignInParamsType) => Promise<void>;
}

export default function SignInForm({ onFormSubmit }: SignInFormProps) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true)
    const [searchParams, _] = useSearchParams()
    const { user, setUser, setResetPasswordParams, fetchUser } = useAuthStore()

    const handleForgotPassword = () => {
        setResetPasswordParams({ email: values.email });
        navigate("/forgot-password");
    };

    const formik = useFormik<SignInParamsType>({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            if (!checking) {
                setSubmitting(true)
                await onFormSubmit(values)
                setSubmitting(false)
            }
        },
        validateOnBlur: true,
        validationSchema: SignInParamsSchema,
    });

    const {
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        setSubmitting,
        isValid
    } = formik;


    useEffect(() => {
        if (user) {
            const checkAuth = async () => {
                const user = await fetchUser()
                if (user) {
                    const PATH = searchParams.get("nextURL") || PATHS.ACTION_BOARD
                    toast.success(ERROR_MESSAGES.AlreadySignedIn, { icon: null })
                    setUser(user)
                    navigate(PATH)
                } else {
                    setUser(null)
                }
            }
            checkAuth()
        }
        setChecking(false)
    }, [])
    return (
        <AuthCard
            title="Sign into your account"
            description="Enter your credentials to access your account">
            <form className="flex flex-col gap-5" onClick={handleSubmit}>
                <Input
                    id="email"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={"Enter your email"}
                    type="email"
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    rightIcon={Mail}
                />
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={"Enter your password"}
                    value={values.password}
                    error={errors.password}
                    touched={touched.password}
                />
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        {/* <Checkbox/> */}
                    </div>
                    <p
                        className="text-primary transition-all text-sm font-medium hover:underline underline-offset-4 cursor-pointer"
                        // href={PATHS.FORGOT_PASSWORD}
                        onClick={handleForgotPassword}
                    >
                        Forgot password?
                    </p>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={!isValid}>
                    Sign In
                </Button>

            </form>
            <AuthDivider className="my-4" />
            <GoogleSignInButton />
            <div className="text-center mt-2">
                <span className="text-xs text-gray-400 mr-2">Are you new here?</span>
                <Link to={PATHS.SIGN_UP}
                    className="text-xs text-primary hover:underline">
                    Create Account
                </Link>
            </div>
        </AuthCard>
    )
}
