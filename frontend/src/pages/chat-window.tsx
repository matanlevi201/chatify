import AppHeader from "@/components/app-header";
import ChatHeader from "@/components/chat-header";
import { useTheme } from "@/components/theme-provider";
import { useActiveConversation } from "@/stores/use-active-conversation";
import ChatTextBox from "@/components/chat-text-box/chat-text-box";
import ChatMessagesBox from "@/components/chat-messages-box";
import { useParams } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "@/stores/use-socket-store";
import { markAsSeen } from "@/lib/query-conversation-utils";
import { useConversations } from "@/hooks/use-conversations";

function ChatWindow() {
  const { theme } = useTheme();
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const { conversations } = useConversations();
  const setActiveConversation = useActiveConversation(
    (state) => state.setActiveConversation
  );
  const closeActiveConversation = useActiveConversation(
    (state) => state.closeActiveConversation
  );

  const emitMessagesSeen = () => {
    const { socket, isConnected } = useSocketStore.getState();
    if (socket && isConnected && chatId) {
      socket.emit("message:seen", { conversationId: chatId });
      markAsSeen(queryClient, chatId);
    }
  };

  useEffect(() => {
    if (conversations) {
      const activeConversation = conversations.find(
        (convo) => convo.id === chatId
      );
      if (activeConversation) {
        setActiveConversation(activeConversation);
        emitMessagesSeen();
      }
    }

    return () => closeActiveConversation();
  }, []);

  return (
    <Suspense fallback={<div>lalala</div>}>
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
    </Suspense>
  );
}

export default ChatWindow;
