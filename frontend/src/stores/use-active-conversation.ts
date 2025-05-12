import { Conversation } from "@/hooks/use-conversations";
import { create } from "zustand";

interface ActiveConversationState {
  activeConversation: Conversation | null;
  setActiveConversation: (activeConversation: Conversation) => void;
  closeActiveConversation: () => void;
}

export const useActiveConversation = create<ActiveConversationState>((set) => ({
  activeConversation: null,
  setActiveConversation: (activeConversation: Conversation) =>
    set(() => ({ activeConversation })),
  closeActiveConversation: () => set(() => ({ activeConversation: null })),
}));
