import { useEffect, useRef } from "react";
import ChatMessage, { Message } from "./chat-message";
import { ScrollArea } from "./ui/scroll-area";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { conversationMessages } from "@/api/conversations";
import { publishMessageSeen } from "@/events/pulishers";
import { useSocket } from "@/stores/use-socket";

function ChatMessagesBox() {
  const { chatId } = useParams();
  const isReady = useSocket((state) => state.isReady);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesQuery = useQuery<Message[]>({
    queryKey: ["get_messages", chatId],
    queryFn: async () => {
      const messages = await conversationMessages(chatId!);
      publishMessageSeen(chatId!);
      return messages;
    },
    enabled: !!chatId,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (isReady) publishMessageSeen(chatId!);
  }, [isReady]);

  useEffect(() => {
    if (!messagesQuery.data) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messagesQuery.data]);

  if (messagesQuery.isPending) return <div>Loading messages...</div>;
  if (messagesQuery.isError) return <div>{messagesQuery.error.message}</div>;

  return (
    <ScrollArea className="container max-w-5xl max-h-[calc(100vh-174px)]">
      <div className="space-y-2.5 p-2.5 pb-0">
        {messagesQuery.data.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

export default ChatMessagesBox;
