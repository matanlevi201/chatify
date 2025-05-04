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
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  setConversations: (conversations: Conversation[]) =>
    set(() => ({ conversations: conversations })),
  updateConversation: (id: string, updates: Partial<Conversation> = {}) => {
    const conversations = get().conversations;
    const conversationIndex = conversations.findIndex(
      (convo) => convo.id === id
    );
    if (conversationIndex < 0) return;
    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex] = {
      ...updatedConversations[conversationIndex],
      ...updates,
    };
    return set(() => ({ conversations: updatedConversations }));
  },
}));
