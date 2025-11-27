import type { ActionCard, GenerateActionCardResult } from '@/types/action-board';
import type { Product } from '@/types/product';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    actionCards: ActionCard[]
    selectedCard: ActionCard | null,
    affectedProducts: Product[]
    actionCardResult: GenerateActionCardResult | null

}

interface Actions {
    setActionCards: (any: any[]) => void,
    setSelectedCard: (selectedCard: any | null) => void,
    setAffectedProducts: (product: Product[]) => void,
    setActionCardResult: (actionCardResult: GenerateActionCardResult | null) => void,
    resetStore: () => void,
}

export const useActionBoardStore = create(
    persist<State & Actions>(
        (set, _) => ({
            actionCards: [],
            affectedProducts: [],
            selectedCard: null,
            actionCardResult: null,
            setActionCards: (actionCards) => set({ actionCards }),
            setSelectedCard: (selectedCard) => set({ selectedCard }),
            setActionCardResult: (actionCardResult) => set({ actionCardResult }),
            setAffectedProducts: (affectedProducts) => set({ affectedProducts }),
            resetStore: () => {
                set({
                    actionCards: [],
                    selectedCard: null,
                    actionCardResult: null,
                })
            }
        }),
        {
            name: 'action-board-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
