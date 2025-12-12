import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Integrations { shopify: boolean }
interface State {
    integrations: Integrations

}

interface Actions {
    setIntegrations: (any: Integrations) => void,
    resetStore: () => void,
}

export const useIntegrationsStore = create(
    persist<State & Actions>(
        (set, _) => ({
            integrations: { shopify: false },
            setIntegrations: (integrations) => set({ integrations }),
            resetStore: () => {
                set({
                    integrations: { shopify: false },
                })
            }
        }),
        {
            name: 'integrations-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
