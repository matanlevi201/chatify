import { CheckCheckIcon } from "lucide-react";
import AvatarWithStatus from "./avatar-with-status";
import { format } from "date-fns";
import { useCurrentUserStore } from "@/stores/use-current-user";

interface ChatMessageProps {
  sender: {
    id: string;
    fullname: string;
    avatarUrl?: string;
  };
  sentAt: Date;
  content: string;
  status: "sent" | "seen";
}

function ChatMessage({ sender, sentAt, content, status }: ChatMessageProps) {
  const { currentUser } = useCurrentUserStore();

  const formatted = format(sentAt, "h:mm a").toLowerCase();
  const showMessageStatus = status && sender.id === currentUser.id;

  return (
    <div
      className={`flex gap-2 items-end ${
        sender.id === currentUser.id ? "flex-row-reverse" : ""
      }`}
    >
      <AvatarWithStatus
        url={sender.avatarUrl ?? ""}
        name={sender.fullname}
        className="[@media(max-width:500px)]:hidden shadow-lg"
      />
      <div
        className={`p-3 rounded-xl shadow-lg rounded-tl-none max-w-[75%] ${
          sender.id === currentUser.id
            ? "bg-primary text-white rounded-tl-xl rounded-tr-none"
            : "bg-background"
        }`}
      >
        <p>{content}</p>
        <span
          className={`text-xs text-muted-background ${
            sender.id === currentUser.id ? "float-end flex gap-1" : ""
          }`}
        >
          {formatted}
          {showMessageStatus && (
            <CheckCheckIcon
              className={`size-4  ${status === "seen" ? "text-blue-700" : ""}`}
            />
          )}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
