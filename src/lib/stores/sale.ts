import type { Sale } from '@/types/sales';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    sales: Sale[]
    selectedSale: Sale | null,

    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean

}

interface Actions {
    setSales: (sale: Sale[]) => void,
    setSelectedSale: (selectedSale: Sale | null) => void,

    openCreateModalOpen: () => void
    openEditModalOpen: (product: Sale) => void
    openDeleteModalOpen: (sale: Sale) => void
    setIsCreateModalOpen: (opened: boolean) => void
    setIsEditModalOpen: (opened: boolean) => void
    setIsDeleteModalOpen: (opened: boolean) => void

    resetStore: () => void
}

export const useSalesStore = create(
    persist<State & Actions>(
        (set, _) => ({
            sales: [],
            selectedSale: null,
            isCreateModalOpen: false,
            isEditModalOpen: false,
            isDeleteModalOpen: false,
            setSales: (sales) => set({ sales }),
            setSelectedSale: (selectedSale) => set({ selectedSale }),

            openCreateModalOpen: () => set({ isCreateModalOpen: true }),
            openEditModalOpen: (product) => set({ isEditModalOpen: true, selectedSale: product }),
            openDeleteModalOpen: (product) => set({ isDeleteModalOpen: true, selectedSale: product }),

            setIsCreateModalOpen: (opened) => set({ isCreateModalOpen: opened }),
            setIsEditModalOpen: (opened) => set({ isEditModalOpen: opened }),
            setIsDeleteModalOpen: (opened) => set({ isDeleteModalOpen: opened }),

            resetStore: () => {
                set({
                    sales: [],
                    selectedSale: null,
                    isCreateModalOpen: false,
                    isEditModalOpen: false,
                    isDeleteModalOpen: false,
                })
            }
        }),
        {
            name: 'sale-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
