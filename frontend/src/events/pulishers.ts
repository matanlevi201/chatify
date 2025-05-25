import { useSocket } from "@/stores/use-socket";

export const conversationJoin = (id: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("conversation:join", { id });
};

export const conversationLeave = (id: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("conversation:leave", { id });
};

export const publishTypingStart = (conversationId: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("typing:start", { conversationId });
};

export const publishTypingEnd = (conversationId: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("typing:end", { conversationId });
};

export const publishMessageSeen = (conversationId: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("message:seen", { conversationId });
};

export const publishMessageSend = (content: string, conversationId: string) => {
  const socket = useSocket.getState().getSocket();
  socket.emit("message:send", { content, conversationId });
};

export const publishFriendOnline = () => {
  const socket = useSocket.getState().getSocket();
  socket.emit("friend:online", undefined);
};

export const publishFriendAway = () => {
  const socket = useSocket.getState().getSocket();
  socket.emit("friend:away", undefined);
};

export const publishFriendOffline = () => {
  const socket = useSocket.getState().getSocket();
  socket.emit("friend:offline", undefined);
};

export const publishConversationsAutoJoin = () => {
  const socket = useSocket.getState().getSocket();
  socket.emit("conversations:auto:join", undefined);
};
