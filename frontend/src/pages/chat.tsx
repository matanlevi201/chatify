import AppHeader from "@/components/app-header";
import { useTheme } from "@/components/theme-provider";
import ChatInput from "@/components/chat-input";
import ChatHeader from "@/components/chat-header";
import {
  Conversation,
  useConversationsStore,
} from "@/stores/use-conversation-store";
import { Loader2Icon } from "lucide-react";
import { Message, useMessagesStore } from "@/stores/use-messages-store";
import { useQuery } from "@tanstack/react-query";
import { conversationMessages } from "@/api/conversations";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useResizeDetector } from "react-resize-detector";
import ChatMessagesBox from "@/components/chat-messages-box";
import { useSocketStore } from "@/stores/use-socket-store";

function Chat() {
  const { theme } = useTheme();
  const { chatId } = useParams();
  const { height, ref } = useResizeDetector();
  const setActiveConversation = useConversationsStore(
    (state) => state.setActiveConversation
  );
  const { data, isLoading, isError } = useQuery<{
    messages: Message[];
    conversation: Conversation | null;
  }>({
    queryKey: ["get_conversation_and_messages"],
    queryFn: async () => {
      if (!chatId) return { messages: [], conversation: null };
      const { conversations } = useConversationsStore.getState();
      const conversation = conversations.find((convo) => convo.id === chatId);
      if (!conversation) return { messages: [], conversation: null };
      const { setMessages } = useMessagesStore.getState();
      setActiveConversation(chatId);
      const messages = await conversationMessages(chatId);
      setMessages(messages);
      return { messages, conversation };
    },
    initialData: { messages: [], conversation: null },
  });
  useEffect(() => {
    const emitMessagesSeen = () => {
      const { socket, isConnected } = useSocketStore.getState();
      if (socket && isConnected && chatId) {
        const { updateConversation } = useConversationsStore.getState();
        socket.emit("message:seen", { conversationId: chatId });
        updateConversation(chatId, { unseenMessagesCount: 0 });
      }
    };
    emitMessagesSeen();
    return () => setActiveConversation();
  }, []);

  if (!data.conversation || isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  if (isError) return <div>Error...</div>;

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

        <ChatMessagesBox height={height} />

        <div
          ref={ref}
          className="container max-w-3xl flex p-4 absolute bottom-0 items-center gap-2"
        >
          <ChatInput />
        </div>
      </div>
    </div>
  );
}

export default Chat;
