import { CheckCheckIcon } from "lucide-react";
import AvatarWithStatus from "./avatar-with-status";
import { format } from "date-fns";
import { memo } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Message } from "@/hooks/use-messages";
import { Conversation } from "@/hooks/use-conversations";

function ChatMessageComponent({
  message,
  conversation,
}: {
  message: Message;
  conversation: Conversation;
}) {
  const { sender, createdAt, content, readBy } = message;
  const { currentUser } = useCurrentUser();

  const formatted = format(createdAt, "h:mm a").toLowerCase();
  const showMessageStatus = sender.id === currentUser.id;
  const seenByAll = readBy.length === conversation.participants.length - 1;

  return (
    <div
      className={`flex gap-2 ${
        sender.id === currentUser.id ? "flex-row-reverse" : ""
      }`}
    >
      <AvatarWithStatus
        url={sender.avatarUrl ?? ""}
        name={sender.fullname}
        className="[@media(max-width:500px)]:hidden shadow-lg mt-1 size-8"
      />
      <div
        className={`p-2 rounded-md shadow-lg max-w-[75%] flex flex-col gap-1  ${
          sender.id === currentUser.id
            ? "bg-primary text-white rounded-tr-none"
            : "bg-background rounded-tl-none"
        }`}
      >
        <p className="text-sm">{content}</p>
        <span
          className={`text-xs text-muted-background ${
            sender.id === currentUser.id
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
  prevProps: { message: Message; conversation: Conversation },
  nextProps: { message: Message; conversation: Conversation }
) => {
  return (
    prevProps.conversation.id === nextProps.conversation.id &&
    prevProps.message.readBy.length === nextProps.message.readBy.length
  );
};

const ChatMessage = memo(ChatMessageComponent, areEqual);

export default ChatMessage;
