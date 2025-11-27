import type { Product } from '@/types/product';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


interface State {
    products: Product[]
    selectedProduct: Product | null,

    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean
}

interface Actions {
    setProducts: (product: Product[]) => void,
    setSelectedProduct: (selectedProduct: Product | null) => void,

    openCreateModalOpen: () => void
    openEditModalOpen: (product: Product) => void
    openDeleteModalOpen: (product: Product) => void
    setIsCreateModalOpen: (opened: boolean) => void
    setIsEditModalOpen: (opened: boolean) => void
    setIsDeleteModalOpen: (opened: boolean) => void

    resetStore: () => void
}

export const useProductStore = create(
    persist<State & Actions>(
        (set, _) => ({
            products: [],
            selectedProduct: null,
            isCreateModalOpen: false,
            isEditModalOpen: false,
            isDeleteModalOpen: false,
            setProducts: (products) => set({ products }),
            setSelectedProduct: (selectedProduct) => set({ selectedProduct }),

            openCreateModalOpen: () => set({ isCreateModalOpen: true }),
            openEditModalOpen: (product) => set({ isEditModalOpen: true, selectedProduct: product }),
            openDeleteModalOpen: (product) => set({ isDeleteModalOpen: true, selectedProduct: product }),

            setIsCreateModalOpen: (opened) => set({ isCreateModalOpen: opened }),
            setIsEditModalOpen: (opened) => set({ isEditModalOpen: opened }),
            setIsDeleteModalOpen: (opened) => set({ isDeleteModalOpen: opened }),


            resetStore: () => {
                set({
                    products: [],
                    selectedProduct: null,
                    isCreateModalOpen: false,
                    isEditModalOpen: false,
                    isDeleteModalOpen: false,
                })
            }
        }),
        {
            name: 'product-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
