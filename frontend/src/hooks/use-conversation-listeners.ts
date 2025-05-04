import { useConversationsStore } from "@/stores/use-conversation-store";
import { useSocket } from "@/stores/use-socket-context";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function useConversationListeners() {
  const [conversations, updateConversation] = useConversationsStore(
    useShallow((state) => [state.conversations, state.updateConversation])
  );
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !conversations.length) return;

    conversations.forEach((convo) => {
      socket.emit("conversation:join", { id: convo.id });
    });

    socket.on("typing:start", (data) => {
      const { conversationId, userId, fullname } = data;
      updateConversation(conversationId, { userTyping: { userId, fullname } });
    });

    socket.on("typing:end", (data) => {
      const { conversationId } = data;
      updateConversation(conversationId, { userTyping: undefined });
    });

    return () => {
      conversations.forEach((convo) => {
        socket.emit("conversation:leave", { id: convo.id });
      });
      socket.off("typing:start");
      socket.off("typing:end");
    };
  }, [socket, isConnected, conversations]);

  return null;
}
