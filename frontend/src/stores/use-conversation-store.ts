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
  setParticipantStatus: (
    participantId: string,
    status: Conversation["participants"]["0"]["status"]
  ) => void;
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
  setParticipantStatus: (
    participantId: string,
    status: Conversation["participants"]["0"]["status"]
  ) => {
    const { activeConversation, conversations } = get();
    let updatedActiveConversation: Conversation | null = null;
    const updatedConversations = conversations.map((convo) => {
      const participantIndex = convo.participants.findIndex(
        (par) => par.id === participantId
      );

      if (participantIndex === -1) return convo;
      const participants = [...convo.participants];
      participants[participantIndex] = {
        ...participants[participantIndex],
        status,
      };
      const updatedConvo = { ...convo, participants };
      if (activeConversation?.id === convo.id) {
        updatedActiveConversation = updatedConvo;
      }
      return updatedConvo;
    });

    return set(() => ({
      conversations: updatedConversations,
      activeConversation: updatedActiveConversation ?? activeConversation,
    }));
  },
}));
