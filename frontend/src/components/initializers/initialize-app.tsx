import { getConversations } from "@/api/conversations";
import {
  Conversation,
  useConversationsStore,
} from "@/stores/use-conversation-store";
import { useCurrentUserStore } from "@/stores/use-current-user";
import { useQuery } from "@tanstack/react-query";
import React from "react";

function InitializeApp({ children }: { children: React.ReactNode }) {
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const setConversations = useConversationsStore(
    (state) => state.setConversations
  );
  const conversations = useConversationsStore((state) => state.conversations);
  const { isError, isLoading } = useQuery<Conversation[]>({
    queryKey: ["get_conversations"],
    queryFn: async (): Promise<Conversation[]> => {
      if (!currentUser.id) return [];
      const data = await getConversations();
      setConversations(data);
      return data;
    },
    initialData: [],
  });

  if (!currentUser.id) return;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  if (conversations.length === 0) return <div>Loading conversations...</div>;

  return <>{children}</>;
}

export default InitializeApp;
