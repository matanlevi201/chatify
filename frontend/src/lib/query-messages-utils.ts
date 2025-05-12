import { Message } from "@/hooks/use-messages";
import { QueryClient } from "@tanstack/react-query";

export const addMessage = (
  queryClient: QueryClient,
  conversationId: string,
  newMessage: Message
) => {
  queryClient.setQueryData<Message[]>(
    ["get_messages", conversationId],
    (old) => [...(old || []), newMessage]
  );
};

export const updateMessage = (
  queryClient: QueryClient,
  conversationId: string,
  user: {
    id: string;
    fullname: string;
    avatarUrl: string;
  }
) => {
  queryClient.setQueryData<Message[]>(["get_messages", conversationId], (old) =>
    (old ?? []).map((msg) => {
      const alreadyRead = msg.readBy.some((u) => u.id === user.id);
      if (alreadyRead) return msg;
      return {
        ...msg,
        readBy: [...msg.readBy, user],
      };
    })
  );
};
