import { useConversationListeners } from "@/hooks/use-conversation-listeners";
import { useFriendListeners } from "@/hooks/use-friend-listeners";
import { useRequestListeners } from "@/hooks/use-request-listeners";

function InitializeListeners({ children }: { children: React.ReactNode }) {
  useRequestListeners();
  useFriendListeners();
  useConversationListeners();
  return <>{children}</>;
}

export default InitializeListeners;
