import OnboardingSteps from "@/components/custom/onboarding-steps";
import { APP_NAME } from "@/lib/constants";

export default function Onboarding() {

    return (
        <div className="flex pt-32 justify-center">
            <title>{`Onboarding | ${APP_NAME}`}</title>
            <OnboardingSteps />
        </div>
    )
}
