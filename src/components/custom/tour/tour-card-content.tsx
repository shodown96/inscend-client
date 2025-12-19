import { Button } from "@/components/ui/button"
import { useTourStore } from "@/lib/stores/tour"
import { useTour } from "@reactour/tour"
import { X } from "lucide-react"


export default function TourCardContent({ }: any) {
    const { setIsOpen, setCurrentStep, currentStep, steps } = useTour()
    const { activeTour, setTourState } = useTourStore()
    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }
    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }
    const handleSkip = () => {
        setIsOpen(false);
        handleClose()
    }
    const handleClose = () => {
        setIsOpen(false)
        setTourState({
            [activeTour]: true
        })
    }
    const currentContent = steps?.[currentStep]?.content as any
    return (
        <div>
            <div>
                <div className="flex justify-between">
                    <p>{currentStep + 1} / {steps.length}</p>
                    <X className="h-5 w-5 cursor-pointer" onClick={handleClose} />
                </div>
                <p className="mb-4" dangerouslySetInnerHTML={{ __html: currentContent }}></p>
            </div>
            <div className="flex justify-end gap-2">
                <Button variant={'secondary'} onClick={handlePrevious} disabled={currentStep === 0}>Previous</Button>
                <Button variant={'secondary'} onClick={handleNext} disabled={currentStep === steps.length - 1}>Next</Button>
                <Button onClick={handleSkip} className="bg-primary">
                    {currentStep === steps.length - 1 ? 'Finish' : 'Skip'}
                </Button>
            </div>
        </div>

    )
}
