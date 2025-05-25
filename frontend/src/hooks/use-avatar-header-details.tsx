import { UsersIcon } from "lucide-react";
import { useCurrentUserQuery } from "./use-current-user-query";
import { Conversation } from "./use-conversations-query";

function useAvatarHeaderDetails(conversation: Conversation | null) {
  const currentUserQuery = useCurrentUserQuery();

  if (!conversation || !currentUserQuery.data) return null;

  const resolveName = () => {
    if (conversation.isGroup) {
      return conversation.name ?? "";
    }
    const participant = conversation.participants.find(
      ({ id }) => id !== currentUserQuery.data.id
    );
    return participant?.fullname ?? "";
  };

  const resolveAvatarUrl = () => {
    if (conversation.isGroup) {
      return conversation.avatarUrl ?? "";
    }
    const participant = conversation.participants.find(
      ({ id }) => id !== currentUserQuery.data.id
    );
    return participant?.avatarUrl ?? "";
  };

  const resolveFallbackIcon = () => {
    if (conversation.isGroup) {
      return conversation.avatarUrl ? undefined : <UsersIcon />;
    }
  };

  const resolveStatus = () => {
    if (
      conversation.inActiveParticipants.find(
        ({ id }) => id === currentUserQuery.data.id
      )
    )
      return;
    if (!conversation.isGroup) {
      const participant = conversation.participants.find(
        ({ id }) => id !== currentUserQuery.data.id
      );
      return participant?.status;
    }
  };
  const resolveUserTyping = () => {
    if (
      conversation.inActiveParticipants.find(
        ({ id }) => id === currentUserQuery.data.id
      )
    )
      return;
    if (conversation.userTyping) {
      return conversation.isGroup
        ? `${conversation.userTyping.fullname} typing...`
        : "typing...";
    }
  };

  return {
    conversation,
    resolveName,
    resolveAvatarUrl,
    resolveFallbackIcon,
    resolveStatus,
    resolveUserTyping,
  };
}

export default useAvatarHeaderDetails;
