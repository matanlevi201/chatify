import type { UserDoc } from "../models/user";
import { activeRooms, onlineUsers } from "../socket";

export const publishSendRequest = (socketId: string, sender: UserDoc) => {
  const targetSocket = onlineUsers.get(socketId);
  if (targetSocket) {
    targetSocket.emit("request:send", {
      fromUser: sender.fullname,
      avatarUrl: sender.avatarUrl,
      message: "New Friend Request",
    });
  }
};

export const publishRejectRequest = (socketId: string) => {
  const targetSocket = onlineUsers.get(socketId);
  if (targetSocket) {
    targetSocket.emit("request:reject");
  }
};

export const publishAcceptRequest = async (
  sender: UserDoc,
  receiver: UserDoc,
  conversationId: string
) => {
  const senderSocket = onlineUsers.get(sender.clerkId);
  const receiverSocket = onlineUsers.get(receiver.clerkId);
  if (senderSocket) {
    senderSocket.emit("request:accept", {
      message: `You and ${sender.fullname} are now friends`,
      conversationId,
    });
  }
  if (receiverSocket) {
    receiverSocket.emit("request:accept", {
      message: `You and ${receiver.fullname} are now friends`,
      conversationId,
    });
  }
};

export const publishCancelRequest = (socketId: string) => {
  const targetSocket = onlineUsers.get(socketId);
  if (targetSocket) {
    targetSocket.emit("request:cancel");
  }
};

export const publishFriendRemove = (
  socketId: string,
  targetSocketId: string,
  conversationId: string | null
) => {
  const socket = onlineUsers.get(socketId);
  const targetSocket = onlineUsers.get(targetSocketId);
  if (targetSocket) {
    targetSocket.emit("friend:remove");
    if (conversationId) {
      targetSocket.leave(conversationId);
      activeRooms.delete(conversationId);
    }
  }
  if (socket && conversationId) {
    socket.leave(conversationId);
    activeRooms.delete(conversationId);
  }
};
