import { Server, Socket, type ExtendedError } from "socket.io";
import { verifyToken } from "@clerk/express";
import http from "http";
import { ForbiddenError, NotAuthorizedError } from "./errors";
import { env } from "./config/env";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";
import { User } from "./models/user";
import { Conversation } from "./models/conversation";
import { Message, type PopulatedMessageDoc } from "./models/message";

const onlineUsers = new Map<string, Socket<ServerToClientEvents>>();

const checkUserIsParticipant = async ({
  conversationId,
  clerkId,
}: {
  conversationId: string;
  clerkId: string;
}) => {
  const user = await User.findOne({ clerkId });
  if (!user) {
    throw new ForbiddenError();
  }
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: user.id,
  });
  if (!conversation) {
    throw new ForbiddenError();
  }
  return { user, conversation };
};

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
        const { user } = await checkUserIsParticipant({
          conversationId: id,
          clerkId: userId,
        });
        console.log(`${user.fullname} join room`);
        socket.join(id);
      };

      const conversationLeave = async ({ id }: { id: string }) => {
        const { user } = await checkUserIsParticipant({
          conversationId: id,
          clerkId: userId,
        });
        console.log(`${user.fullname} leave room`);
        socket.leave(id);
      };

      const typingStart = async ({
        conversationId,
      }: {
        conversationId: string;
      }) => {
        const { user } = await checkUserIsParticipant({
          conversationId,
          clerkId: userId,
        });
        socket.broadcast.to(conversationId).emit("typing:start", {
          conversationId,
          userId: user.id,
          fullname: user.fullname,
        });
        console.log("typing:start");
      };

      const typingEnd = async ({
        conversationId,
      }: {
        conversationId: string;
      }) => {
        await checkUserIsParticipant({ conversationId, clerkId: userId });
        socket.broadcast
          .to(conversationId)
          .emit("typing:end", { conversationId });
        console.log("typing:end");
      };

      const messageSend = async ({
        content,
        conversationId,
      }: {
        content: string;
        conversationId: string;
      }) => {
        const { user, conversation } = await checkUserIsParticipant({
          conversationId,
          clerkId: userId,
        });
        const newMessage = Message.build({
          sender: user.id,
          content,
          conversation: conversationId,
          readBy: [],
        });
        await newMessage.save();
        const message = (await newMessage.populate([
          { path: "sender" },
          { path: "readBy" },
        ])) as PopulatedMessageDoc;
        conversation.lastMessage = message.id;
        conversation.participants.map((par) => {
          const participantId = par.toString();
          const unseenCount = conversation.unseenCounts.get(participantId) ?? 0;

          if (participantId !== user.id) {
            conversation.unseenCounts.set(participantId, unseenCount + 1);
          }
        });
        await conversation.save();
        socket.broadcast.to(conversationId).emit("message:new", {
          message,
          unseenCounts: conversation.unseenCounts,
        });
        socket.emit("message:sent", { message });
        console.log("messagea:new:sent");
      };

      const messageSeen = async ({
        conversationId,
      }: {
        conversationId: string;
      }) => {
        const { user, conversation } = await checkUserIsParticipant({
          conversationId,
          clerkId: userId,
        });
        const result = await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: user.id },
            readBy: { $ne: user.id },
          },
          {
            $addToSet: { readBy: user.id },
          }
        );
        conversation.unseenCounts.set(user.id, 0);
        await conversation.save();

        if (result.modifiedCount > 0) {
          socket.broadcast.to(conversationId).emit("message:read", {
            user: {
              id: user.id,
              fullname: user.fullname,
              avatarUrl: user.avatarUrl,
            },
          });
          console.log("message:read");
        }
      };

      socket.on("conversation:join", (data) => conversationJoin(data));
      socket.on("conversation:leave", (data) => conversationLeave(data));
      socket.on("typing:start", (data) => typingStart(data));
      socket.on("typing:end", (data) => typingEnd(data));
      socket.on("message:send", (data) => messageSend(data));
      socket.on("message:seen", (data) => messageSeen(data));

      socket.on("disconnect", () => {
        console.log("user disconnect");
        onlineUsers.delete(userId);
      });
    }
  );
  console.log("Socket ready ✨");
  return { io, onlineUsers };
}
