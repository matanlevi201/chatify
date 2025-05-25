import { CurrentUser } from "@/hooks/use-current-user-query";
import { notification } from "@/lib/notification";
import {
  getCurrentConversations,
  setParticipantStatus,
  updateConversation,
} from "@/lib/query-conversation-utils";
import { addMessage, updateMessage } from "@/lib/query-messages-utils";
import { queryClient } from "@/main";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { ServerToClientEvents, useSocket } from "@/stores/use-socket";

export const handleTypingStart: ServerToClientEvents["typing:start"] = (
  data
) => {
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

export const handleTypingEnd: ServerToClientEvents["typing:end"] = (data) => {
  updateConversation(queryClient, data.conversationId, {
    userTyping: undefined,
  });
  const { activeConversation, setActiveConversation } =
    useActiveConversation.getState();
  if (activeConversation) {
    setActiveConversation({ ...activeConversation, userTyping: undefined });
  }
};

export const handleNewMessage: ServerToClientEvents["message:new"] = (data) => {
  const currentUser = queryClient.getQueryData<CurrentUser>([
    "get_current_user",
  ]);
  if (!currentUser) return;
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
    const socket = useSocket.getState().getSocket();
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

export const handleMessageSent: ServerToClientEvents["message:sent"] = (
  data
) => {
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

export const handleMessageRead: ServerToClientEvents["message:read"] = (
  data
) => {
  const { activeConversation } = useActiveConversation.getState();
  if (activeConversation) {
    updateMessage(queryClient, activeConversation.id, data.user);
  }
};

export const friendRemove: ServerToClientEvents["friend:remove"] = async () => {
  const { activeConversation, setActiveConversation } =
    useActiveConversation.getState();
  await queryClient.refetchQueries({ queryKey: ["get_friends"] });
  await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
  await queryClient.invalidateQueries({ queryKey: ["get_conversations"] });
  if (activeConversation) {
    setActiveConversation({
      ...activeConversation,
      inActiveParticipants: [...activeConversation.participants],
    });
  }
};

export const friendOnline: ServerToClientEvents["friend:online"] = (data) => {
  const { setActiveConversation, activeConversation } =
    useActiveConversation.getState();
  if (activeConversation) {
    setActiveConversation({
      ...activeConversation,
      participants: activeConversation.participants.map((par) => {
        if (par.id !== data.friendId) return par;
        return { ...par, status: "online" };
      }),
    });
  }
  setParticipantStatus(queryClient, data.friendId, "online");
};

export const friendOffline: ServerToClientEvents["friend:offline"] = (data) => {
  const { setActiveConversation, activeConversation } =
    useActiveConversation.getState();
  if (activeConversation) {
    setActiveConversation({
      ...activeConversation,
      participants: activeConversation.participants.map((par) => {
        if (par.id !== data.friendId) return par;
        return { ...par, status: "offline" };
      }),
    });
  }
  setParticipantStatus(queryClient, data.friendId, "offline");
};

export const friendAway: ServerToClientEvents["friend:away"] = (data) => {
  const { setActiveConversation, activeConversation } =
    useActiveConversation.getState();
  if (activeConversation) {
    setActiveConversation({
      ...activeConversation,
      participants: activeConversation.participants.map((par) => {
        if (par.id !== data.friendId) return par;
        return { ...par, status: "away" };
      }),
    });
  }
  setParticipantStatus(queryClient, data.friendId, "away");
};

export const handleRequestSend: ServerToClientEvents["request:send"] = async (
  data
) => {
  await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
  notification({
    name: "generic",
    props: {
      type: "info",
      title: "Friend Request",
      description: `${data.fromUser} wants to add you as a friend`,
    },
  });
};

export const handleRequestCancel: ServerToClientEvents["request:cancel"] =
  async () => {
    await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
  };

export const handleRequestReject: ServerToClientEvents["request:reject"] =
  async () => {
    await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
  };

export const handleRequstsAccept: ServerToClientEvents["request:accept"] =
  async (data) => {
    const { activeConversation, setActiveConversation } =
      useActiveConversation.getState();
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ["get_friends"] }),
      queryClient.invalidateQueries({ queryKey: ["get_requests"] }),
      queryClient.invalidateQueries({ queryKey: ["get_conversations"] }),
    ]);
    const socket = useSocket.getState().getSocket();
    socket.emit("conversation:join", { id: data.conversationId });
    const conversations = getCurrentConversations(queryClient);
    if (activeConversation) {
      const conversation = conversations.find(
        (convo) => convo.id === activeConversation.id
      );
      if (conversation) setActiveConversation(conversation);
    }
    notification({
      name: "generic",
      props: {
        type: "success",
        title: "Friend Request",
        description: data.message,
      },
    });
  };
