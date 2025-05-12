import { getConversations } from "@/api/conversations";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  inActiveParticipants: {
    id: string;
    fullname: string;
    avatarUrl: string;
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

export const useConversations = () => {
  const { data, isLoading, isError } = useSuspenseQuery<Conversation[]>({
    queryKey: ["get_conversations"],
    queryFn: getConversations,
    staleTime: Infinity,
  });

  return {
    conversations: data,
    isLoading,
    isError,
  };
};
