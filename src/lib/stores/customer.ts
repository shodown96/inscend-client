import type { Customer } from '@/types/customer';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    customers: Customer[]
    selectedCustomer: Customer | null,

    isCreateModalOpen: boolean
    isEditModalOpen: boolean
    isDeleteModalOpen: boolean

}

interface Actions {
    setCustomers: (customer: Customer[]) => void,
    setSelectedCustomer: (selectedCustomer: Customer | null) => void,

    openCreateModalOpen: () => void
    openEditModalOpen: (product: Customer) => void
    openDeleteModalOpen: (customer: Customer) => void
    setIsCreateModalOpen: (opened: boolean) => void
    setIsEditModalOpen: (opened: boolean) => void
    setIsDeleteModalOpen: (opened: boolean) => void
}

export const useCustomerStore = create(
    persist<State & Actions>(
        (set, _) => ({
            customers: [],
            selectedCustomer: null,
            isCreateModalOpen: false,
            isEditModalOpen: false,
            isDeleteModalOpen: false,
            setCustomers: (customers) => set({ customers }),
            setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),

            openCreateModalOpen: () => set({ isCreateModalOpen: true }),
            openEditModalOpen: (product) => set({ isEditModalOpen: true, selectedCustomer: product }),
            openDeleteModalOpen: (product) => set({ isDeleteModalOpen: true, selectedCustomer: product }),

            setIsCreateModalOpen: (opened) => set({ isCreateModalOpen: opened }),
            setIsEditModalOpen: (opened) => set({ isEditModalOpen: opened }),
            setIsDeleteModalOpen: (opened) => set({ isDeleteModalOpen: opened }),
        }),
        {
            name: 'customer-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
