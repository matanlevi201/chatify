import { create } from "zustand";

export type Conversation = {
  id: string;
  name?: string;
  isGroup: boolean;
  avatarUrl?: string;
  participants: {
    id: string;
    fullname: string;
    avatarUrl: string;
    status: "online" | "offline" | "away";
  }[];
  lastMessage?: {
    id: string;
    content: string;
    createdAt: Date;
  };
  unseenMessagesCount?: number;
  userTyping?: {
    userId: string;
    fullname: string;
  };
};

interface ConversationsState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  setActiveConversation: (id?: string) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  setConversations: (conversations: Conversation[]) =>
    set(() => ({ conversations: conversations })),
  updateConversation: (id: string, updates: Partial<Conversation> = {}) => {
    const { conversations, activeConversation } = get();
    const conversationIndex = conversations.findIndex(
      (convo) => convo.id === id
    );
    if (conversationIndex < 0) return;
    const updatedConversations = [...conversations];
    const updatedConversation = {
      ...updatedConversations[conversationIndex],
      ...updates,
    };
    updatedConversations[conversationIndex] = updatedConversation;
    return set(() => ({
      conversations: updatedConversations,
      activeConversation:
        activeConversation?.id === id
          ? updatedConversation
          : activeConversation,
    }));
  },
  setActiveConversation: (id: string = "") =>
    set(() => ({
      activeConversation:
        get().conversations.find((convo) => convo.id === id) ?? null,
    })),
}));
