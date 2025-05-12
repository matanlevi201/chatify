import { useActiveConversation } from "@/stores/use-active-conversation";
import AvatarWithStatus from "./avatar-with-status";
import useAvatarHeaderDetails from "@/hooks/use-avatar-header-details";

function ChatHeader() {
  const conversation = useActiveConversation(
    (state) => state.activeConversation
  );
  const detailsResolvers = useAvatarHeaderDetails(conversation);

  if (!detailsResolvers) return;
  if (!conversation) return;

  const {
    resolveName,
    resolveAvatarUrl,
    resolveFallbackIcon,
    resolveStatus,
    resolveUserTyping,
  } = detailsResolvers;

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
