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
  lastMessage?: string;
  unseenMessagesCount?: number;
};

interface ConversationsState {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
}

export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  setConversations: (conversations: Conversation[]) =>
    set(() => ({ conversations: conversations })),
}));
