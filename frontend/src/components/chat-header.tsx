import { useCurrentUserStore } from "@/stores/use-current-user";
import { Conversation } from "@/stores/use-conversation-store";
import AvatarWithStatus from "./avatar-with-status";
import { UsersIcon } from "lucide-react";

interface ChatHeaderProps {
  conversation: Conversation;
}

function ChatHeader({ conversation }: ChatHeaderProps) {
  const { currentUser } = useCurrentUserStore();

  const resolveName = () => {
    if (conversation.isGroup) {
      return conversation.name ?? "";
    }
    const participant = conversation.participants.find(
      ({ id }) => id !== currentUser.id
    );
    return participant?.fullname ?? "";
  };

  const resolveAvatarUrl = () => {
    if (conversation.isGroup) {
      return conversation.avatarUrl ?? "";
    }
    const participant = conversation.participants.find(
      ({ id }) => id !== currentUser.id
    );
    return participant?.avatarUrl ?? "";
  };

  const resolveFallbackIcon = () => {
    if (conversation.isGroup) {
      return conversation.avatarUrl ? undefined : <UsersIcon />;
    }
  };

  const resolveStatus = () => {
    if (!conversation.isGroup) {
      const participant = conversation.participants.find(
        ({ id }) => id !== currentUser.id
      );
      return participant?.status;
    }
  };
  const resolveUserTyping = () => {
    if (conversation.userTyping) {
      return conversation.isGroup
        ? `${conversation.userTyping.fullname} typing...`
        : "typing...";
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <AvatarWithStatus
        url={resolveAvatarUrl()}
        name={resolveName()}
        status={resolveStatus()}
        fallbackIcon={resolveFallbackIcon()}
        className="size-8"
      />
      <div className="flex flex-col justify-center">
        <span className="text-sm font-medium truncate">{resolveName()}</span>
        <span className="text-xs text-muted-foreground">
          {conversation.userTyping
            ? resolveUserTyping()
            : resolveStatus() ??
              conversation.participants
                .map(({ fullname }) => fullname)
                .join(",")}
        </span>
      </div>
    </div>
  );
}

export default ChatHeader;
