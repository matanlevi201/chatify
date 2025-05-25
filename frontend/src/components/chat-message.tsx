import { CheckCheckIcon } from "lucide-react";
import AvatarWithStatus from "./avatar-with-status";
import { format } from "date-fns";
import { memo } from "react";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";

export type Message = {
  id: string;
  sender: { id: string; fullname: string; avatarUrl: string };
  content: string;
  readBy: { id: string; fullname: string; avatarUrl: string }[];
  conversation: string;
  createdAt: Date;
  status?: "pending" | "sent" | "delivered";
};

function ChatMessageComponent({ message }: { message: Message }) {
  const currentUserQuery = useCurrentUserQuery();
  const conversation = useActiveConversation(
    (state) => state.activeConversation
  );
  if (!currentUserQuery.data) return null;
  const { sender, createdAt, content, readBy } = message;

  const formatted = format(createdAt, "h:mm a").toLowerCase();
  const showMessageStatus = sender.id === currentUserQuery.data.id;
  const seenByAll = conversation
    ? readBy.length === conversation.participants.length - 1
    : false;

  return (
    <div
      className={`flex gap-2 ${
        sender.id === currentUserQuery.data.id ? "flex-row-reverse" : ""
      }`}
    >
      <AvatarWithStatus
        url={sender.avatarUrl ?? ""}
        name={sender.fullname}
        className="[@media(max-width:500px)]:hidden shadow-lg mt-1 size-8"
      />
      <div
        className={`p-2 rounded-md shadow-lg max-w-[75%] flex flex-col gap-1  ${
          sender.id === currentUserQuery.data.id
            ? "bg-primary text-white rounded-tr-none"
            : "bg-background rounded-tl-none"
        }`}
      >
        <p className="text-sm">{content}</p>
        <span
          className={`text-xs text-muted-background ${
            sender.id === currentUserQuery.data.id
              ? "flex gap-1 items-center place-self-end"
              : ""
          }`}
        >
          <span className="text-[0.7rem] text-muted-background opacity-80">
            {formatted}
          </span>
          {showMessageStatus && (
            <CheckCheckIcon
              className={`size-3  ${seenByAll ? "text-blue-700" : ""}`}
            />
          )}
        </span>
      </div>
    </div>
  );
}

const areEqual = (
  prevProps: { message: Message },
  nextProps: { message: Message }
) => {
  return prevProps.message.readBy.length === nextProps.message.readBy.length;
};

const ChatMessage = memo(ChatMessageComponent, areEqual);

export default ChatMessage;
