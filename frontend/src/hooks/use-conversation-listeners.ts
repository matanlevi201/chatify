import {
  useSocketStore,
  ServerToClientEvents,
} from "@/stores/use-socket-store";
import { useEffect } from "react";
import { useConversations } from "./use-conversations";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { useQueryClient } from "@tanstack/react-query";
import { addMessage, updateMessage } from "@/lib/query-messages-utils";
import { updateConversation } from "@/lib/query-conversation-utils";
import { useCurrentUser } from "./use-current-user";

export function useConversationListeners() {
  const queryClient = useQueryClient();
  const { conversations } = useConversations();
  const { currentUser } = useCurrentUser();

  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);

  useEffect(() => {
    if (!socket || !isConnected) return;

    conversations.forEach((convo) => {
      const isInActive = convo.inActiveParticipants.find(
        ({ id }) => id === currentUser.id
      );
      if (isInActive && !convo.isGroup) return;
      socket.emit("conversation:join", { id: convo.id });
    });

    const handleTypingStart: ServerToClientEvents["typing:start"] = (data) => {
      const { conversationId, userId, fullname } = data;
      updateConversation(queryClient, conversationId, {
        userTyping: { userId, fullname },
      });
      const { activeConversation, setActiveConversation } =
        useActiveConversation.getState();
      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          userTyping: { userId, fullname },
        });
      }
    };

    const handleTypingEnd: ServerToClientEvents["typing:end"] = (data) => {
      updateConversation(queryClient, data.conversationId, {
        userTyping: undefined,
      });
      const { activeConversation, setActiveConversation } =
        useActiveConversation.getState();
      if (activeConversation) {
        setActiveConversation({ ...activeConversation, userTyping: undefined });
      }
    };

    const handleNewMessage: ServerToClientEvents["message:new"] = (data) => {
      const { message, unseenCounts } = data;
      const { activeConversation } = useActiveConversation.getState();
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
        updateConversation(queryClient, message.conversation, {
          ...updates,
          unseenMessagesCount: 0,
        });
        addMessage(queryClient, activeConversation.id, message);
        return;
      }
      updateConversation(queryClient, message.conversation, {
        ...updates,
        unseenMessagesCount: unseenCounts[currentUser.id] || 1,
      });
    };

    const handleMessageSent: ServerToClientEvents["message:sent"] = (data) => {
      const { message } = data;
      const { activeConversation } = useActiveConversation.getState();

      updateConversation(queryClient, message.conversation, {
        lastMessage: {
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
        },
      });
      if (activeConversation) {
        addMessage(queryClient, activeConversation.id, message);
      }
    };

    const handleMessageRead: ServerToClientEvents["message:read"] = (data) => {
      const { activeConversation } = useActiveConversation.getState();
      if (activeConversation) {
        updateMessage(queryClient, activeConversation.id, data.user);
      }
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
