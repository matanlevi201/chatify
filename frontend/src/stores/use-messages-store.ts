import { create } from "zustand";

export type Message = {
  id: string;
  sender: { id: string; fullname: string; avatarUrl: string };
  content: string;
  readBy: { id: string; fullname: string; avatarUrl: string }[];
  conversation: string;
  createdAt: Date;
  status?: "pending" | "sent" | "delivered";
};

interface MessagesState {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  addReadBy: (user: {
    id: string;
    fullname: string;
    avatarUrl: string;
  }) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messages: [],
  setMessages: (messages: Message[]) => set(() => ({ messages })),
  addMessage: (message: Message) =>
    set(() => ({ messages: [...get().messages, message] })),
  addReadBy: (user: { id: string; fullname: string; avatarUrl: string }) => {
    const updatedMessages = get().messages.map((msg) => {
      const alreadyRead = msg.readBy.some((u) => u.id === user.id);
      if (alreadyRead) return msg;

      return {
        ...msg,
        readBy: [...msg.readBy, user],
      };
    });
    set(() => ({ messages: updatedMessages }));
  },
}));
