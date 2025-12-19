import { tourMapping } from '@/lib/constants/tour'
import { useTourStore } from '@/lib/stores/tour'
import type { TourState } from '@/types/tour'
import { useTour } from '@reactour/tour'
import { useEffect } from 'react'

export default function useAppTour(tourType: keyof TourState, initiate = true) {
    const { tourState, setActiveTour } = useTourStore()
    const { setIsOpen, setSteps } = useTour()

    const checkTourState = async () => {
        console.log("tourState?.[tourType]",tourState, tourType, tourState?.[tourType])
        if (tourState?.[tourType] !== true) {
            if (setSteps) {
                setActiveTour(tourType)
                setSteps(tourMapping[tourType])
            }
            setIsOpen(true)
        }
    }

    useEffect(() => {
        if (initiate) {
            checkTourState()
        }
    }, [initiate])

    return null
}
