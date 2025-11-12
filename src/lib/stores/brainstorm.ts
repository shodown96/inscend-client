import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
    selected: string;

    // Actions
    setCurrentMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setChatHistory: (history: ChatSession[]) => void;
    setCurrentSessionId: (id: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setSelected: (value: string) => void;
    resetChat: () => void;
}

export const useBrainstormStore = create<ChatStore>()(
    persist(
        (set) => ({
            currentMessages: [],
            chatHistory: [],
            currentSessionId: null,
            isLoading: false,
            selected: "Action Board",

            setCurrentMessages: (messages) => set({ currentMessages: messages }),
            addMessage: (message) =>
                set((state) => ({
                    currentMessages: [...state.currentMessages, message],
                })),
            setChatHistory: (history) => set({ chatHistory: history }),
            setCurrentSessionId: (id) => set({ currentSessionId: id }),
            setIsLoading: (loading) => set({ isLoading: loading }),
            setSelected: (value) => set({ selected: value }),
            resetChat: () =>
                set({
                    currentMessages: [],
                    chatHistory: [],
                    currentSessionId: null,
                    isLoading: false,
                    selected: "Action Board",
                }),
        }),
        {
            name: "chat-store",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
