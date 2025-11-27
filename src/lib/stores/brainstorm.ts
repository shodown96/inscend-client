import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import type { Sale } from "@/types/sales";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type ViewType = 'chat' | 'history'
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

interface ChatStore {
    currentMessages: Message[];
    chatHistory: ChatSession[];
    currentSessionId: string | null;
    isLoading: boolean;
    selectedArea: string;
    businessData: {
        products: Product[]
        sales: Sale[]
        customers: Customer[]
    } | null

    // Actions
    setBusinessData: (businessData: ChatStore['businessData']) => void,
    setCurrentMessages: (messages: any[]) => void;
    addMessage: (message: Message) => void;
    setChatHistory: (history: ChatSession[]) => void;
    setCurrentSessionId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setSelectedArea: (value: string) => void;
    resetChat: () => void;
    resetStore: () => void,
}

export const useBrainstormStore = create<ChatStore>()(
    persist(
        (set) => ({
            currentMessages: [],
            chatHistory: [],
            currentSessionId: null,
            isLoading: false,
            selectedArea: "Action Board",
            businessData: null,

            setBusinessData: (businessData) => set({ businessData }),
            setCurrentMessages: (messages) => set({ currentMessages: messages }),
            addMessage: (message) =>
                set((state) => ({
                    currentMessages: [...state.currentMessages, message],
                })),
            setChatHistory: (history) => set({ chatHistory: history }),
            setCurrentSessionId: (id) => set({ currentSessionId: id }),
            setIsLoading: (loading) => set({ isLoading: loading }),
            setSelectedArea: (value) => set({ selectedArea: value }),
            resetChat: () =>
                set({
                    currentMessages: [],
                    chatHistory: [],
                    currentSessionId: null,
                    isLoading: false,
                    selectedArea: "Action Board",
                }),
            resetStore: () => {
                set({
                    currentMessages: [],
                    chatHistory: [],
                    currentSessionId: null,
                    isLoading: false,
                    selectedArea: "Action Board",
                    businessData: null,
                })
            }
        }),
        {
            name: "brainstorm-store",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
