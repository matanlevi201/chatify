import AppHeader from "@/components/app-header";
import { useTheme } from "@/components/theme-provider";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import ChatHeader from "@/components/chat-header";
import { useConversationsStore } from "@/stores/use-conversation-store";
import { useShallow } from "zustand/shallow";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";

type Message = {
  id: string;
  sender: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  sentAt: Date;
  content: string;
  status: "sent" | "seen";
};

function Chat() {
  const { chatId } = useParams();
  const [conversations] = useConversationsStore(
    useShallow((state) => [state.conversations])
  );

  const conversation = conversations.find((conv) => conv.id === chatId);
  const { theme } = useTheme();
  const messages: Message[] = [];

  if (!conversation)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen">
      <AppHeader>
        <ChatHeader conversation={conversation} />
      </AppHeader>
      <div className="relative grow h-full flex flex-col items-center">
        <img
          src={`/${theme}-chat-bg.svg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover bg-accent/75 dark:bg-accent/15"
        />

        <div className="container max-w-5xl flex-1 z-10 py-2 flex flex-col gap-4 justify-end">
          {messages.map((msg) => (
            <ChatMessage key={`${msg.id}`} {...msg} />
          ))}
        </div>

        <ChatInput />
      </div>
    </div>
  );
}

export default Chat;
