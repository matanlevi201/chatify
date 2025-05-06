import { useConversationListeners } from "@/hooks/use-conversation-listeners";
import { useFriendListeners } from "@/hooks/use-friend-listeners";
import { useRequestListeners } from "@/hooks/use-request-listeners";
import { useSocketStore } from "@/stores/use-socket-store";
import { useIdle } from "@uidotdev/usehooks";
import { useEffect } from "react";

function InitializeListeners({ children }: { children: React.ReactNode }) {
  const idle = useIdle(300000);
  useRequestListeners();
  useFriendListeners();
  useConversationListeners();

  const isConnected = useSocketStore((state) => state.isConnected);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (!socket || !isConnected) return;
    if (idle) socket.emit("friend:away", undefined);
    if (!idle) socket.emit("friend:online", undefined);
  }, [idle]);

  return <>{children}</>;
}

export default InitializeListeners;
