import AppHeader from "@/components/app-header";
import ChatHeader from "@/components/chat-header";
import { useTheme } from "@/components/theme-provider";
import { useParams } from "react-router-dom";
import ChatMessagesBox from "@/components/chat-messages-box";
import { useEffect } from "react";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { useQueryClient } from "@tanstack/react-query";
import ChatTextBox from "@/components/chat-text-box/chat-text-box";
import { markAsSeen } from "@/lib/query-conversation-utils";
import { useConversationsQuery } from "@/hooks/use-conversations-query";

function ConversationWindow() {
  const { theme } = useTheme();
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const conversationsQuery = useConversationsQuery();

  useEffect(() => {
    const conversations = conversationsQuery.data;
    if (!conversations) return;
    if (chatId) {
      const active = conversations.find((c) => c.id === chatId);
      if (active) {
        useActiveConversation.getState().setActiveConversation(active);
        markAsSeen(queryClient, chatId);
      }
    }
    return () => useActiveConversation.getState().closeActiveConversation();
  }, [conversationsQuery.data]);

  if (!conversationsQuery.data) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      <AppHeader>
        <ChatHeader />
      </AppHeader>

      <div className="relative grow flex flex-col items-center">
        <img
          src="/light-chat-bg.svg"
          className={`absolute inset-0 w-full h-full object-cover bg-accent/75 ${
            theme === "light" ? "block" : "hidden"
          }`}
        />
        <img
          src="/dark-chat-bg.svg"
          className={`absolute inset-0 w-full h-full object-cover bg-accent/15 ${
            theme === "dark" ? "block" : "hidden"
          }`}
        />
        <ChatMessagesBox />

        <div className="container max-w-3xl flex p-2 absolute bottom-0 items-center gap-2">
          <ChatTextBox />
        </div>
      </div>
    </div>
  );
}

export default ConversationWindow;
