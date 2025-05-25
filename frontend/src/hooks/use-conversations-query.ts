import { useQuery } from "@tanstack/react-query";
import { getConversations } from "@/api/conversations";

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

export const useConversationsQuery = () => {
  const conversationsQuery = useQuery<Conversation[]>({
    queryKey: ["get_conversations"],
    queryFn: getConversations,
  });
  return conversationsQuery;
};
