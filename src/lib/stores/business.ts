import type { Customer } from '@/types/customer';
import type { Product } from '@/types/product';
import type { Sale } from '@/types/sales';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface BusinessData {
    sales: Sale[],
    products: Product[],
    customers: Customer[]
}
interface State {
    businessData: BusinessData | null
}

interface Actions {
    setBusinessData: (businessData: BusinessData | null) => void,
    resetStore: () => void
}

export const useBusinessDataStore = create(
    persist<State & Actions>(
        (set, _) => ({
            businessData: null,
            setBusinessData: (businessData) => set({ businessData }),

            resetStore: () => set({ businessData: null })
        }),
        {
            name: 'business-data-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
