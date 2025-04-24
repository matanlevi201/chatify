import AppHeader from "@/components/app-header";
import { useTheme } from "@/components/theme-provider";
// import { useParams } from "react-router-dom";
import { useCurrentUserStore } from "@/stores/use-current-user";
import ChatMessage from "@/components/chat-message";
import ChatInput from "@/components/chat-input";
import ChatHeader from "@/components/chat-header";

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

type Conversation = {
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
};

function Chat() {
  const { currentUser } = useCurrentUserStore();
  // const { chatId } = useParams();
  const { theme } = useTheme();
  const messages: Message[] = [
    {
      id: "1",
      sender: {
        id: currentUser.id,
        fullname: "My NAME",
      },
      sentAt: new Date(),
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autem
                voluptate at magnam maxime nisi, hic pariatur adipisci molestiae
                veniam mollitia eveniet, incidunt.`,
      status: "seen",
    },
    {
      id: "2",
      sender: {
        id: "1",
        fullname: "Firend Name",
      },
      sentAt: new Date(),
      content:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autemvoluptate at magnam maxime nisi.",
      status: "seen",
    },
    {
      id: "3",
      sender: {
        id: currentUser.id,
        fullname: "My NAME",
      },
      sentAt: new Date(),
      content:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Autemvoluptate at magnam maxime nisi.",
      status: "sent",
    },
  ];
  const conversation: Conversation = {
    id: "132",
    name: "Chat name",
    isGroup: false,
    participants: [
      {
        id: "123",
        fullname: "Full Name",
        avatarUrl: "/avatar-1.png",
        status: "online",
      },
    ],
  };

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
