import type { Socket } from "socket.io";
import type { ClientToServerEvents, ServerToClientEvents } from "../types";
import { findByClerkId } from "../services/user.service";
import {
  findActiveConversationsIds,
  findConversationById,
  guardIsActiveParticipant,
} from "../services/conversation.service";
import {
  handleMessageCreation,
  markMessagesAsSeen,
} from "../services/message.service";
import { onlineUsers, activeRooms } from "../socket";
import { UserStatus, type PopulatedUserDoc } from "../models/user";

export const handleConversationJoin = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { id, clerkId }: { id: string; clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    await guardIsActiveParticipant(id, user.id);
    console.log(`${user.fullname} join room ${id}`);
    socket.join(id);
    activeRooms.set(id, id);
  } catch (error) {
    console.error({ msg: "Failed to join conversation", error });
    socket.emit("error", { msg: "Failed to join conversation" });
  }
};

export const handleConversationLeave = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { id, clerkId }: { id: string; clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    await guardIsActiveParticipant(id, user.id);
    console.log(`${user.fullname} leave room ${id}`);
    socket.leave(id);
    activeRooms.delete(id);
  } catch (error) {
    console.error({ msg: "Failed to leave conversation", error });
    socket.emit("error", { msg: "Failed to leave conversation" });
  }
};

export const handleTypingStart = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { conversationId, clerkId }: { conversationId: string; clerkId: string }
) => {
  try {
    if (activeRooms.get(conversationId)) {
      const user = await findByClerkId(clerkId);
      // await guardIsActiveParticipant(conversationId, user.id);
      socket.broadcast.to(conversationId).emit("typing:start", {
        conversationId,
        userId: user.id,
        fullname: user.fullname,
      });
      console.log("typing:start");
    }
  } catch (error) {
    console.error({ msg: "Failed to emit start typing", error });
    socket.emit("error", { msg: "Failed to emit start typing" });
  }
};

export const handleTypingEnd = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { conversationId, clerkId }: { conversationId: string; clerkId: string }
) => {
  try {
    if (activeRooms.get(conversationId)) {
      const user = await findByClerkId(clerkId);
      // await guardIsActiveParticipant(conversationId, user.id);
      socket.broadcast
        .to(conversationId)
        .emit("typing:end", { conversationId });
      console.log("typing:end");
    }
  } catch (error) {
    console.error({ msg: "Failed to emit end typing", error });
    socket.emit("error", { msg: "Failed to emit end typing" });
  }
};

export const handleMessageSend = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  {
    content,
    conversationId,
    clerkId,
  }: { content: string; conversationId: string; clerkId: string }
) => {
  try {
    if (activeRooms.get(conversationId)) {
      const user = await findByClerkId(clerkId);
      // await guardIsActiveParticipant(conversationId, user.id);
      const conversation = await findConversationById(conversationId);
      const { message, unseenCounts } = await handleMessageCreation(
        content,
        user,
        conversation
      );
      socket.broadcast.to(conversationId).emit("message:new", {
        message,
        unseenCounts: unseenCounts,
      });
      socket.emit("message:sent", { message });
      console.log("messagea:new:sent");
    }
  } catch (error) {
    console.error({ msg: "Failed to send message", error });
    socket.emit("error", { msg: "Failed to send message" });
  }
};

export const handleMessageSeen = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { conversationId, clerkId }: { conversationId: string; clerkId: string }
) => {
  try {
    if (activeRooms.get(conversationId)) {
      const user = await findByClerkId(clerkId);
      // await guardIsActiveParticipant(conversationId, user.id);
      const conversation = await findConversationById(conversationId);
      const { modifiedMessagesCount } = await markMessagesAsSeen(
        conversation,
        user.id
      );
      if (modifiedMessagesCount > 0) {
        socket.broadcast.to(conversationId).emit("message:read", {
          user: {
            id: user.id,
            fullname: user.fullname,
            avatarUrl: user.avatarUrl,
          },
        });
        console.log("message:read");
      }
    }
  } catch (error) {
    console.error({ msg: "Failed to read message", error });
    socket.emit("error", { msg: "Failed to read message" });
  }
};

export const handleFriendOnline = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { clerkId }: { clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    user.status = UserStatus.ONLINE;
    await user.save();
    const { friends } = (await user.populate("friends")) as PopulatedUserDoc;
    friends.forEach((friend) => {
      console.log("in loop online");
      const friendSocket = onlineUsers.get(friend.clerkId.toString());
      if (friendSocket) {
        friendSocket.emit("friend:online", { friendId: user.id });
      }
    });
  } catch (error) {
    console.error({ msg: "Failed to notify friend online", error });
    socket.emit("error", { msg: "Failed to notify friend online" });
  }
};

export const handleFriendOffline = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { clerkId }: { clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    user.status = UserStatus.OFFLINE;
    await user.save();
    const { friends } = (await user.populate("friends")) as PopulatedUserDoc;
    friends.forEach((friend) => {
      console.log("in loop offline");
      const friendSocket = onlineUsers.get(friend.clerkId.toString());
      if (friendSocket) {
        friendSocket.emit("friend:offline", { friendId: user.id });
      }
    });
  } catch (error) {
    console.error({ msg: "Failed to notify friend offline", error });
    socket.emit("error", { msg: "Failed to notify friend offline" });
  }
};

export const handleFriendAway = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { clerkId }: { clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    user.status = UserStatus.AWAY;
    await user.save();
    const { friends } = (await user.populate("friends")) as PopulatedUserDoc;
    friends.forEach((friend) => {
      console.log("in loop away");
      const friendSocket = onlineUsers.get(friend.clerkId.toString());
      if (friendSocket) {
        friendSocket.emit("friend:away", { friendId: user.id });
      }
    });
  } catch (error) {
    console.error({ msg: "Failed to notify friend away", error });
    socket.emit("error", { msg: "Failed to notify friend away" });
  }
};

export const handleConversationsAutoJoin = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { clerkId }: { clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    const userConversations = await findActiveConversationsIds(user.id);
    userConversations.forEach((convoId) => {
      socket.join(convoId);
      activeRooms.set(convoId, convoId);
      console.log(`${user.fullname} AUTO join room ${convoId}`);
    });
  } catch (error) {
    console.error({ msg: "Failed to AUTO join conversation", error });
    socket.emit("error", { msg: "Failed to AUTO join conversation" });
  }
};

export const handleConversationsAutoLeave = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  { clerkId }: { clerkId: string }
) => {
  try {
    const user = await findByClerkId(clerkId);
    const userConversations = await findActiveConversationsIds(user.id);
    userConversations.forEach((convoId) => {
      socket.leave(convoId);
      activeRooms.delete(convoId);
      console.log(`${user.fullname} AUTO leave room ${convoId}`);
    });
  } catch (error) {
    console.error({ msg: "Failed to AUTO leave conversation", error });
    socket.emit("error", { msg: "Failed to AUTO leave conversation" });
  }
};
