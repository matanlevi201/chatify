import { memo, useEffect, useRef } from "react";
import { useMessagesStore } from "@/stores/use-messages-store";
import ChatMessage from "./chat-message";
import { useConversationsStore } from "@/stores/use-conversation-store";
import { Conversation } from "@/stores/use-conversation-store";
import { Message } from "@/stores/use-messages-store";
import { ScrollArea } from "./ui/scroll-area";

function ChatMessagesBoxComponent({
  activeConversation,
  messages,
  height,
}: {
  activeConversation: Conversation;
  messages: Message[];
  height?: number;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, height]);

  return (
    <ScrollArea
      className="container max-w-5xl"
      style={{
        maxHeight: `calc(100vh - ${height ? height + 80 : height}px)`,
      }}
    >
      <div className="space-y-2.5 p-2.5 pb-0 [@media(max-width:500px)]:px-0">
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
    height?: number;
  },
  nextProps: {
    activeConversation: Conversation;
    messages: Message[];
    height?: number;
  }
) => {
  return (
    prevProps.activeConversation.id === nextProps.activeConversation.id &&
    prevProps.messages.length === nextProps.messages.length &&
    prevProps.messages.every(
      (msg, i) => msg.readBy.length === nextProps.messages[i].readBy.length
    ) &&
    prevProps.height === nextProps.height
  );
};

const ChatMessagesBox = memo(ChatMessagesBoxComponent, areEqual);

function ChatMessagesBoxContainer({ height }: { height?: number }) {
  const activeConversation = useConversationsStore(
    (state) => state.activeConversation
  );
  const messages = useMessagesStore((state) => state.messages);

  if (!activeConversation) return null;

  return (
    <ChatMessagesBox
      activeConversation={activeConversation}
      messages={messages}
      height={height}
    />
  );
}

export default ChatMessagesBoxContainer;
