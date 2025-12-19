import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESS_TYPES, PATHS } from "@/lib/constants";
import { ProfileParamsSchema, type ProfileParamsType } from "@/lib/validations/auth";
import { useFormik } from "formik";
import { CustomSelect } from "../custom/custom-select";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { useTourStore } from "@/lib/stores/tour";
import { useNavigate } from "react-router";
import { useTour } from "@reactour/tour";
import { WelcomeGuide } from "@/lib/constants/tour";

interface SignInFormProps {
    onFormSubmit: (values: ProfileParamsType) => void;
}

export default function ProfileForm({ onFormSubmit }: SignInFormProps) {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { resetStore } = useTourStore()
    const { setSteps, setCurrentStep } = useTour()
    const formik = useFormik<ProfileParamsType>({
        initialValues: {
            name: "",
            email: "",
            business: {
                name: "",
                type: ""
            }
        },
        onSubmit: onFormSubmit,
        validateOnBlur: true,
        validationSchema: ProfileParamsSchema,
    });

    const {
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
        values,
        errors,
        touched,
        isSubmitting,
        isValid
    } = formik;

    useEffect(() => {
        if (user) {
            setValues({
                ...values,
                name: user.name,
                email: user.email,
                business: user.business ? ({
                    name: user.business.name,
                    type: user.business.type,
                }) : values.business
            })
        }
    }, [user])

    return (
        <div className="w-full shadow p-3 rounded-lg bg-white">
            <form className="flex flex-col gap-5" >
                <Input
                    id="name"
                    label="Name"
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
                    disabled
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                />
                <Input
                    id="business.name"
                    label="Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={"Enter your name"}
                    value={values.business.name}
                    error={errors.business?.name}
                    touched={touched.business?.name}
                />

                <CustomSelect
                    label="Business Type"
                    options={BUSINESS_TYPES}
                    className="w-full"
                    defaultValue={values.business.type}
                    onChange={v => setFieldValue("type", v)} />
                <div className="flex gap-4 items-center">
                    <Button
                        type="submit"
                        className="w-max"
                        loading={isSubmitting}
                        disabled={!isValid} onClick={() => handleSubmit()}>
                        Update
                    </Button>
                    <Button
                        type="button"
                        variant={'outline'}
                        className="w-max"
                        loading={isSubmitting}
                        disabled={!isValid} onClick={() => {
                            resetStore()
                            navigate(PATHS.ACTION_BOARD)
                            if (setSteps) {
                                setCurrentStep(0)
                                setSteps(WelcomeGuide)
                            }
                        }}>
                        Restart Tour
                    </Button>
                </div>

            </form>
        </div>
    )
}
