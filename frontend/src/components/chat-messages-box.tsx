import { memo, Suspense, useEffect, useRef } from "react";
import ChatMessage from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { useActiveConversation } from "@/stores/use-active-conversation";
import useMessages, { Message } from "@/hooks/use-messages";
import { useParams } from "react-router-dom";
import { Conversation } from "@/hooks/use-conversations";

function ChatMessagesBoxComponent({
  activeConversation,
  messages,
}: {
  activeConversation: Conversation;
  messages: Message[];
  height?: number;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <ScrollArea className="container max-w-5xl max-h-[calc(100vh-174px)]">
      <div className="space-y-2.5 p-2.5 pb-0">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            conversation={activeConversation}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

const areEqual = (
  prevProps: {
    activeConversation: Conversation;
    messages: Message[];
  },
  nextProps: {
    activeConversation: Conversation;
    messages: Message[];
  }
) => {
  return (
    prevProps.activeConversation.id === nextProps.activeConversation.id &&
    prevProps.messages.length === nextProps.messages.length &&
    prevProps.messages.every(
      (msg, i) => msg.readBy.length === nextProps.messages[i].readBy.length
    )
  );
};

const ChatMessagesBox = memo(ChatMessagesBoxComponent, areEqual);

function ChatMessagesBoxContainer() {
  const { chatId } = useParams();
  const activeConversation = useActiveConversation(
    (state) => state.activeConversation
  );
  const { messages } = useMessages(chatId ?? "");

  if (!activeConversation) return null;

  return (
    <Suspense fallback={<div>Loading messages...</div>}>
      <ChatMessagesBox
        activeConversation={activeConversation}
        messages={messages}
      />
    </Suspense>
  );
}

export default ChatMessagesBoxContainer;
