import { BUSINESS_TYPES } from "@/lib/constants";
import { SetupBusinessParamsSchema, type SetupBusinessParamsType } from "@/lib/validations/auth";
import { useFormik } from "formik";
import AuthCard from "../custom/auth-card";
import { CustomSelect } from "../custom/custom-select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SetupBusinessFormProps {
    onFormSubmit: (values: SetupBusinessParamsType) => void;
}

export default function SetupBusinessForm({ onFormSubmit }: SetupBusinessFormProps) {
    const formik = useFormik<SetupBusinessParamsType>({
        initialValues: {
            name: "",
            type: "",
        },
        onSubmit: onFormSubmit,
        validateOnBlur: true,
        isInitialValid: false,
        validationSchema: SetupBusinessParamsSchema,
    });

    const {
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
        isSubmitting,
        isValid
    } = formik;

    return (
        <AuthCard
            title="Let’s set up your business in Inscend."
            description="We’ll shape your workspace around your business.">
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <Input
                    id="name"
                    label="Business Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={"Enter your name"}
                    value={values.name}
                    error={errors.name}
                    touched={touched.name}
                />
                <CustomSelect
                    label="Business Type"
                    options={BUSINESS_TYPES}
                    className="w-full"
                    onChange={v => setFieldValue("type", v)} />
                <Button
                    type="submit"
                    className="w-full"
                    loading={isSubmitting}
                    disabled={!isValid}>
                    Continue
                </Button>

            </form>
        </AuthCard>
    )
}
