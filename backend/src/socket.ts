import { Server, Socket, type ExtendedError } from "socket.io";
import { verifyToken } from "@clerk/express";
import http from "http";
import { ForbiddenError, NotAuthorizedError } from "./errors";
import { env } from "./config/env";
import type { ServerToClientEvents } from "./types";

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

  io.on("connection", (socket) => {
    const userId = socket.user.sub;
    console.log("user connected");

    onlineUsers.set(userId, socket);

    socket.on("disconnect", () => {
      console.log("user disconnect");
      onlineUsers.delete(userId);
    });
  });
  console.log("Socket ready ✨");
  return { io, onlineUsers };
}
