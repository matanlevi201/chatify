import { Server, Socket, type ExtendedError } from "socket.io";
import { verifyToken } from "@clerk/express";
import http from "http";
import { ForbiddenError, NotAuthorizedError } from "./errors";
import { env } from "./config/env";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import { User } from "./models/user";
import { Conversation } from "./models/conversation";

const onlineUsers = new Map<string, Socket<ServerToClientEvents>>();

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
    (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
      const userId = socket.user.sub;
      console.log("user connected");

      onlineUsers.set(userId, socket);

      const conversationJoin = async ({ id }: { id: string }) => {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new ForbiddenError();
        }
        const conversation = await Conversation.findOne({
          _id: id,
          participants: user.id,
        });
        if (!conversation) {
          throw new ForbiddenError();
        }
        console.log(`${user.fullname} join room: ${id}`);
        socket.join(id);
      };

      const conversationLeave = async ({ id }: { id: string }) => {
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
          throw new ForbiddenError();
        }
        const conversation = await Conversation.findOne({
          _id: id,
          participants: user.id,
        });
        if (!conversation) {
          throw new ForbiddenError();
        }
        console.log(`${user.fullname} leave room: ${id}`);
        socket.leave(id);
      };

      socket.on("conversation:join", (data) => conversationJoin(data));
      socket.on("conversation:leave", (data) => conversationLeave(data));

      socket.on("disconnect", () => {
        console.log("user disconnect");
        onlineUsers.delete(userId);
      });
    }
  );
  console.log("Socket ready ✨");
  return { io, onlineUsers };
}
