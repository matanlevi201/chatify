import { useConversationsStore } from "@/stores/use-conversation-store";
import { useCurrentUserStore } from "@/stores/use-current-user";
import { useMessagesStore } from "@/stores/use-messages-store";
import {
  useSocketStore,
  ServerToClientEvents,
} from "@/stores/use-socket-store";
import { useEffect } from "react";

export function useConversationListeners() {
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  useEffect(() => {
    if (!socket || !isConnected) return;

    const { conversations } = useConversationsStore.getState();

    conversations.forEach((convo) => {
      socket.emit("conversation:join", { id: convo.id });
    });

    const handleTypingStart: ServerToClientEvents["typing:start"] = (data) => {
      const { updateConversation } = useConversationsStore.getState();
      const { conversationId, userId, fullname } = data;
      updateConversation(conversationId, {
        userTyping: { userId, fullname },
      });
    };

    const handleTypingEnd: ServerToClientEvents["typing:end"] = (data) => {
      const { updateConversation } = useConversationsStore.getState();
      updateConversation(data.conversationId, { userTyping: undefined });
    };

    const handleNewMessage: ServerToClientEvents["message:new"] = (data) => {
      const { message, unseenCounts } = data;

      const { addMessage } = useMessagesStore.getState();
      const { currentUser } = useCurrentUserStore.getState();
      const { activeConversation, updateConversation } =
        useConversationsStore.getState();

      const updates = {
        lastMessage: {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
        },
      };

      const isActive = activeConversation?.id === message.conversation;

      if (isActive) {
        socket.emit("message:seen", { conversationId: message.conversation });
        updateConversation(message.conversation, {
          ...updates,
          unseenMessagesCount: 0,
        });
        addMessage(message);
        return;
      }

      updateConversation(message.conversation, {
        ...updates,
        unseenMessagesCount: unseenCounts[currentUser.id] || 1,
      });
    };

    const handleMessageSent: ServerToClientEvents["message:sent"] = (data) => {
      const { message } = data;
      const { updateConversation } = useConversationsStore.getState();
      const { addMessage } = useMessagesStore.getState();

      updateConversation(message.conversation, {
        lastMessage: {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
        },
      });
      addMessage(message);
    };

    const handleMessageRead: ServerToClientEvents["message:read"] = (data) => {
      const { addReadBy } = useMessagesStore.getState();
      addReadBy(data.user);
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:end", handleTypingEnd);
    socket.on("message:new", handleNewMessage);
    socket.on("message:sent", handleMessageSent);
    socket.on("message:read", handleMessageRead);

    return () => {
      conversations.forEach((convo) => {
        socket.emit("conversation:leave", { id: convo.id });
      });

      socket.off("typing:start", handleTypingStart);
      socket.off("typing:end", handleTypingEnd);
      socket.off("message:new", handleNewMessage);
      socket.off("message:sent", handleMessageSent);
      socket.off("message:read", handleMessageRead);
    };
  }, []);

  return null;
}
