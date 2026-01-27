import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";
import AuthCard from "./auth-card";
import { useNavigate } from "react-router";
import { PATHS } from "@/lib/constants";

const steps = [
    {
        title: "Add your products",
        description:
            "Start by adding or importing your products. This gives Inscend context about what you sell and how your business operates.",
    },
    {
        title: "Record your sales",
        description:
            "Add past or ongoing sales manually, or import them. Sales data helps Inscend understand revenue flow and performance trends.",
    },
    {
        title: "Add your customers",
        description:
            "Import or add customers so Inscend can track buying behavior, retention, and engagement over time.",
    },
    {
        title: "Connect Shopify",
        description:
            "If you use Shopify, you can sync products, sales, and customers automatically instead of adding them manually.",
    },
    {
        title: "Get actionable insights",
        description:
            "Once your data is in, Inscend generates action cards. These are clear, prioritized tasks based on your current business state.",
    },
]

export default function OnboardingSteps() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            navigate(PATHS.ACTION_BOARD)
        }
    }

    const handlePrevious = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const currentStep = steps[step]

    return (
        <AuthCard
            title="A brief overview of Inscend"
            description="Here’s what you’ll do after signing up."
            className="max-w-lg">

            <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="space-y-2">

                        <div className="text-sm font-semibold text-slate-900">
                            {currentStep.title}
                        </div>

                        <div className="text-sm text-slate-600">
                            {currentStep.description}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-between gap-2 w-full">
                <Button
                    variant="outline"
                    // className="w-full"
                    disabled={step === 0}
                    onClick={handlePrevious}>
                    Back
                </Button>

                <Button
                    // className="w-full"
                    onClick={handleNext}>
                    {step === steps.length - 1 ? "Get started" : "Continue"}
                </Button>
            </div>

            <div className="mt-3 text-center text-xs text-slate-500">
                Step {step + 1} of {steps.length}
            </div>
        </AuthCard>
    )
}
