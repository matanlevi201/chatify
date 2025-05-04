import { useConversationsStore } from "@/stores/use-conversation-store";
import { useSocket } from "@/stores/use-socket-context";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function useConversationListeners() {
  const [conversations] = useConversationsStore(
    useShallow((state) => [state.conversations])
  );
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !conversations.length) return;

    conversations.forEach((convo) => {
      socket.emit("conversation:join", { id: convo.id });
    });

    return () => {
      conversations.forEach((convo) => {
        socket.emit("conversation:leave", { id: convo.id });
      });
    };
  }, [socket, isConnected, conversations]);

  return null;
}
