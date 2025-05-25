import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import { Server, Socket, type ExtendedError } from "socket.io";
import { ForbiddenError, NotAuthorizedError } from "./errors";
import { verifyToken } from "@clerk/express";
import { env } from "./config/env";
import http from "http";
import {
  handleConversationJoin,
  handleConversationLeave,
  handleConversationsAutoJoin,
  handleConversationsAutoLeave,
  handleFriendAway,
  handleFriendOffline,
  handleFriendOnline,
  handleMessageSeen,
  handleMessageSend,
  handleTypingEnd,
  handleTypingStart,
} from "./events/listeners";

export const onlineUsers = new Map<string, Socket<ServerToClientEvents>>();
export const activeRooms = new Map<string, string>();

export default function initSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(
    async (
      socket: Socket<ServerToClientEvents>,
      next: (err?: ExtendedError) => void
    ) => {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new NotAuthorizedError());
      }
      try {
        const user = await verifyToken(token, {
          secretKey: env.CLERK_SECRET_KEY,
        });
        socket.user = user;
        next();
      } catch (err) {
        next(new ForbiddenError());
      }
    }
  );

  io.on(
    "connection",
    async (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      const userId = socket.user.sub;
      if (!onlineUsers.get(userId)) {
        console.log("user connected");
        onlineUsers.set(userId, socket);
      }

      socket.on("conversation:join", (data) =>
        handleConversationJoin(socket, { ...data, clerkId: userId })
      );
      socket.on("conversation:leave", (data) =>
        handleConversationLeave(socket, { ...data, clerkId: userId })
      );
      socket.on("typing:start", (data) =>
        handleTypingStart(socket, { ...data, clerkId: userId })
      );
      socket.on("typing:end", (data) =>
        handleTypingEnd(socket, { ...data, clerkId: userId })
      );
      socket.on("message:send", (data) =>
        handleMessageSend(socket, { ...data, clerkId: userId })
      );
      socket.on("message:seen", (data) =>
        handleMessageSeen(socket, { ...data, clerkId: userId })
      );
      socket.on("friend:online", () =>
        handleFriendOnline(socket, { clerkId: userId })
      );
      socket.on("friend:offline", () =>
        handleFriendOffline(socket, { clerkId: userId })
      );
      socket.on("friend:away", () =>
        handleFriendAway(socket, { clerkId: userId })
      );
      socket.on("conversations:auto:join", () =>
        handleConversationsAutoJoin(socket, { clerkId: userId })
      );

      socket.on("disconnect", async () => {
        console.log("user disconnect");
        handleConversationsAutoLeave(socket, { clerkId: userId });
        socket.off("conversation:join", handleConversationJoin);
        socket.off("conversation:leave", handleConversationLeave);
        socket.off("typing:start", handleTypingStart);
        socket.off("typing:end", handleTypingEnd);
        socket.off("message:send", handleMessageSend);
        socket.off("message:seen", handleMessageSeen);
        socket.off("friend:online", handleFriendOnline);
        socket.off("friend:offline", handleFriendOffline);
        socket.off("friend:away", handleFriendAway);
        socket.off("conversations:auto:join", handleConversationsAutoJoin);
        onlineUsers.delete(userId);
      });
    }
  );
  console.log("Socket ready ✨");
  return { io, onlineUsers };
}
