import { useCurrentUser } from "./use-current-user";
import { UsersIcon } from "lucide-react";
import { Conversation } from "./use-conversations";

function useAvatarHeaderDetails(conversation: Conversation | null) {
  const { currentUser } = useCurrentUser();

  if (!conversation) return null;

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
    if (
      conversation.inActiveParticipants.find(({ id }) => id === currentUser.id)
    )
      return;
    if (!conversation.isGroup) {
      const participant = conversation.participants.find(
        ({ id }) => id !== currentUser.id
      );
      return participant?.status;
    }
  };
  const resolveUserTyping = () => {
    if (
      conversation.inActiveParticipants.find(({ id }) => id === currentUser.id)
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
