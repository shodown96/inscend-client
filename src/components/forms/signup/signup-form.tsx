import { type SignUpParamsType } from "@/lib/validations/auth";
import { type FormikProps } from "formik";
import { Mail } from "lucide-react";
import AuthCard from "../../custom/auth-card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import AuthDivider from "../../custom/auth-divider";
import { GoogleSignInButton } from "../../custom/google-signin-button";
import { Link } from "react-router";
import { PATHS } from "@/lib/constants";


interface SignupFormProps {
  formik: FormikProps<SignUpParamsType>
}

export default function SignupForm({
  formik,
}: SignupFormProps) {

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    isValid,
    isSubmitting
  } = formik;

  return (

    <AuthCard
      title="Create Account"
      description="Enter your credentials to access your account">
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <Input
          id="name"
          label="Full name"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={"Enter your name"}
          value={values.name}
          error={errors.name}
          touched={touched.name}
        />
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
        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={"Confirm your password"}
          value={values.confirmPassword}
          error={errors.confirmPassword}
          touched={touched.confirmPassword}
        />
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!isValid}>
          Continue with Email
        </Button>

      </form>
      <AuthDivider className="my-4" />
      <GoogleSignInButton text="Continue with Google" />

      <div className="text-center mt-2">
        <span className="text-xs text-gray-400 mr-2">Do you have an account ?</span>
        <Link to={PATHS.SIGN_IN}
          className="text-xs text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
