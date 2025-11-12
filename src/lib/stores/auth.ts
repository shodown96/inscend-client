import { mainClient } from '@/lib/axios';
import type { ResetPasswordParams } from '@/lib/validations/auth';
import type { SignInResult, User } from '@/types/auth';
import { toast } from 'sonner';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { API_ENDPOINTS } from '../constants/api';

interface Tokens {
    accessToken: string | null
}

interface State {
    user: User | null,
    tokens: Tokens | null,
    resetPasswordParams: ResetPasswordParams,
    isAuthenticated: boolean,
    loading: boolean,

}

interface Actions {
    setUser: (user: User | null) => void,
    setAuth: (result: SignInResult) => void,
    setTokens: (tokens: Tokens | null) => void,
    signOut: () => Promise<void>
    fetchUser: () => Promise<User | void>
    setResetPasswordParams: (resetPasswordParams: ResetPasswordParams) => void,
}

export const useAuthStore = create(
    persist<State & Actions>(
        (set, get) => ({
            user: null,
            tokens: null,
            resetPasswordParams: {},
            isAuthenticated: !!get()?.user,
            loading: false,
            setUser: (user) => set({ user }),
            setTokens: (tokens) => set({ tokens }),
            setAuth: (result) => {
                set({
                    user: result.user,
                    tokens: { accessToken: result.accessToken }
                })
            },
            setResetPasswordParams: (resetPasswordParams) => set({
                resetPasswordParams: {
                    ...get().resetPasswordParams,
                    ...resetPasswordParams
                }
            }),
            signOut: async () => {
                try {
                    set({ loading: true })
                    await mainClient.post(API_ENDPOINTS.Auth.SignOut);
                    set({ user: null, tokens: null }); // Clear user data from store
                    toast.success("Signed out successfully");
                    window?.location.replace("/sign-in");
                } catch (err: any) {
                    toast.error(err.response?.data?.message || "Failed to sign out");
                } finally {
                    set({ loading: false })
                }
            },
            fetchUser: async () => {
                try {
                    if (!get().user) {
                        set({ loading: true })
                        const result = await mainClient.get(API_ENDPOINTS.Users.Profile)
                        set({ user: result.data.result })
                        return result.data.result
                    }
                } catch (error) {
                } finally {
                    set({ loading: false })
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
