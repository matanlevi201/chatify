import AvatarWithStatus from "./avatar-with-status";
import { formatDistanceToNow } from "date-fns";
import { useNowUpdate } from "@/hooks/use-now-update";
import { Conversation } from "@/hooks/use-conversations";
import useAvatarHeaderDetails from "@/hooks/use-avatar-header-details";

function NavChatsItem({ conversation }: { conversation: Conversation }) {
  useNowUpdate();
  const detailsResolvers = useAvatarHeaderDetails(conversation);

  if (!detailsResolvers) return;
  const {
    resolveName,
    resolveAvatarUrl,
    resolveFallbackIcon,
    resolveStatus,
    resolveUserTyping,
  } = detailsResolvers;

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
