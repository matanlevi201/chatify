import AvatarWithStatus from "./avatar-with-status";
import { useCurrentUserStore } from "@/stores/use-current-user";
import { UsersIcon } from "lucide-react";
import { Conversation } from "@/stores/use-conversation-store";
import { formatDistanceToNow } from "date-fns";
import { useNowUpdate } from "@/hooks/use-now-update";

function NavChatsItem({ conversation }: { conversation: Conversation }) {
  useNowUpdate();
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
        : "typing..";
    }
  };

  return (
    <div className="flex grow items-center gap-3 truncate">
      <AvatarWithStatus
        url={resolveAvatarUrl()}
        name={resolveName()}
        fallbackIcon={resolveFallbackIcon()}
        status={resolveStatus()}
      />
      <div className="truncate grow">
        <div className="flex justify-between">
          <span className="font-medium truncate">{resolveName()}</span>
          {conversation.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(conversation.lastMessage.createdAt)}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground truncate">
          {resolveUserTyping() ??
            conversation.lastMessage?.content ??
            "Say Hello..."}
        </p>
      </div>
      {conversation.unseenMessagesCount &&
      conversation.unseenMessagesCount > 0 ? (
        <div className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {conversation.unseenMessagesCount}
        </div>
      ) : null}
    </div>
  );
}

export default NavChatsItem;
