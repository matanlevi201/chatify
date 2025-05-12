import { conversationMessages } from "@/api/conversations";
import { useSuspenseQuery } from "@tanstack/react-query";

export type Message = {
  id: string;
  sender: { id: string; fullname: string; avatarUrl: string };
  content: string;
  readBy: { id: string; fullname: string; avatarUrl: string }[];
  conversation: string;
  createdAt: Date;
  status?: "pending" | "sent" | "delivered";
};

function useMessages(conversationId: string) {
  const { data, isLoading, isError } = useSuspenseQuery<Message[]>({
    queryKey: ["get_messages", conversationId],
    queryFn: async () => await conversationMessages(conversationId),
  });

  return {
    messages: data,
    isLoading,
    isError,
  };
}

export default useMessages;
