import type { Customer } from '@/types/customer';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
    customers: Customer[]
    selectedCustomer: Customer | null,

}

interface Actions {
    setCustomers: (customer: Customer[]) => void,
    setSelectedCustomer: (selectedCustomer: Customer | null) => void,
}

export const useCustomerStore = create(
    persist<State & Actions>(
        (set, _) => ({
            customers: [],
            selectedCustomer: null,

            setCustomers: (customers) => set({ customers }),
            setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
        }),
        {
            name: 'action-board-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
