import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    isChecklistMinimized: boolean,
    todos: string[]
}
interface Actions {
    setTodos: (todos: string[]) => void,
    setIsChecklistMinimized: (isChecklistMinimized: boolean) => void,
    resetStore: () => void
}

export const useChecklistStore = create(
    persist<State & Actions>(
        (set, _) => ({
            todos: [],
            isChecklistMinimized: false,
            setTodos: (todos) => set({ todos }),
            setIsChecklistMinimized: (isChecklistMinimized) => set({ isChecklistMinimized }),
            resetStore: () => set({
                todos: [],
                isChecklistMinimized: false
            })
        }),
        {
            name: 'checklist-storage',
            // skipHydration: true, // Requires the useStoreHydration usage
            storage: createJSONStorage(() => localStorage),
        }
    ))