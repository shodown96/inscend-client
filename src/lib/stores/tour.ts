import { type TourState } from '@/types/tour';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mainClient } from '../axios';
import { API_ENDPOINTS } from '../constants';

interface State {
    tourState: TourState | null
    activeTour: keyof TourState;
}
interface Actions {
    setTourState: (tourState: TourState | null) => void,
    setActiveTour: (activeTour: keyof TourState) => void,
    updateRemoteTourState: () => void
    resetStore: () => void
}

export const useTourStore = create(
    persist<State & Actions>(
        (set, get) => ({
            tourState: null,
            activeTour: 'overview',
            setTourState: (tourState) => set({
                tourState: {
                    ...get().tourState,
                    ...tourState
                }
            }),
            setActiveTour: (activeTour) => set({ activeTour }),
            updateRemoteTourState: async () => {
                mainClient.put(API_ENDPOINTS.Users.Profile, {
                    tourTaken: true
                })
            },
            resetStore: () => set({
                tourState: null,
                activeTour: 'overview'
            })
        }),
        {
            name: 'tour-storage',
            // skipHydration: true, // Requires the useStoreHydration usage
            storage: createJSONStorage(() => localStorage),
        }
    ))