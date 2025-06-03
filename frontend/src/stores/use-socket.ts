import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import {
  friendAway,
  friendOffline,
  friendOnline,
  friendRemove,
  handleMessageRead,
  handleMessageSent,
  handleNewGroupConversation,
  handleNewMessage,
  handleRequestCancel,
  handleRequestReject,
  handleRequestSend,
  handleRequstsAccept,
  handleTypingEnd,
  handleTypingStart,
} from "@/events/listeners";
export interface ServerToClientEvents {
  "request:send": (data: {
    fromUser: string;
    avatarUrl: string;
    message: string;
  }) => void;
  "request:cancel": () => void;
  "request:reject": () => void;
  "request:accept": (data: { message: string; conversationId: string }) => void;
  "friend:remove": () => void;
  "typing:start": (data: {
    conversationId: string;
    userId: string;
    fullname: string;
  }) => void;
  "typing:end": (data: { conversationId: string }) => Promise<void> | void;
  "message:new": (data: {
    message: {
      id: string;
      sender: { id: string; fullname: string; avatarUrl: string };
      content: string;
      readBy: { id: string; fullname: string; avatarUrl: string }[];
      conversation: string;
      createdAt: Date;
    };
    unseenCounts: { [key: string]: number };
  }) => void;
  "message:sent": (data: {
    message: {
      id: string;
      sender: { id: string; fullname: string; avatarUrl: string };
      content: string;
      readBy: { id: string; fullname: string; avatarUrl: string }[];
      conversation: string;
      createdAt: Date;
    };
  }) => void;
  "message:read": (data: {
    user: { id: string; fullname: string; avatarUrl: string };
  }) => Promise<void> | void;
  "friend:online": (data: { friendId: string }) => void;
  "friend:offline": (data: { friendId: string }) => void;
  "friend:away": (data: { friendId: string }) => void;
  "conversation:group:new": (data: { id: string }) => void;
}

export interface ClientToServerEvents {
  "conversation:join": (data: { id: string }) => void;
  "conversation:leave": (data: { id: string }) => void;
  "typing:start": (data: { conversationId: string }) => Promise<void> | void;
  "typing:end": (data: { conversationId: string }) => Promise<void> | void;
  "message:send": (data: {
    content: string;
    conversationId: string;
  }) => Promise<void> | void;
  "message:seen": (data: { conversationId: string }) => Promise<void> | void;
  "friend:online": (data: undefined) => void;
  "friend:offline": (data: undefined) => void;
  "friend:away": (data: undefined) => void;
  "conversations:auto:join": (data: undefined) => void;
}

type SocketStore = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isReady: boolean;
  initSocket: (token: string) => Promise<void>;
  getSocket: () => Socket<ServerToClientEvents, ClientToServerEvents>;
};

export const useSocket = create<SocketStore>((set, get) => ({
  socket: null,
  isReady: false,

  async initSocket(token: string) {
    return new Promise<void>((resolve, reject) => {
      const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
        "http://localhost:3000",
        {
          auth: { token },
          transports: ["websocket"],
          withCredentials: true,
        }
      );

      socket.on("connect", () => {
        console.log("Socket connected");

        // register all listeners here
        socket.on("typing:start", handleTypingStart);
        socket.on("typing:end", handleTypingEnd);
        socket.on("message:new", handleNewMessage);
        socket.on("message:sent", handleMessageSent);
        socket.on("message:read", handleMessageRead);
        socket.on("request:send", handleRequestSend);
        socket.on("request:cancel", handleRequestCancel);
        socket.on("request:reject", handleRequestReject);
        socket.on("request:accept", handleRequstsAccept);
        socket.on("friend:remove", friendRemove);
        socket.on("friend:online", friendOnline);
        socket.on("friend:offline", friendOffline);
        socket.on("friend:away", friendAway);
        socket.on("conversation:group:new", handleNewGroupConversation);

        set({ socket, isReady: true });
        resolve();
      });

      socket.on("connect_error", (err) => {
        reject(err);
      });

      socket.on("disconnect", () => {
        // cleanup
        socket.off("typing:start", handleTypingStart);
        socket.off("typing:end", handleTypingEnd);
        socket.off("message:new", handleNewMessage);
        socket.off("message:sent", handleMessageSent);
        socket.off("message:read", handleMessageRead);
        socket.off("request:send", handleRequestSend);
        socket.off("request:cancel", handleRequestCancel);
        socket.off("request:reject", handleRequestReject);
        socket.off("request:accept", handleRequstsAccept);
        socket.off("friend:remove", friendRemove);
        socket.off("friend:online", friendOnline);
        socket.off("friend:offline", friendOffline);
        socket.off("friend:away", friendAway);
        socket.off("conversation:group:new", handleNewGroupConversation);

        set({ isReady: false, socket: null });
      });
    });
  },

  getSocket() {
    const { socket, isReady } = get();
    if (!socket || !isReady) throw new Error("Socket not initialized");
    return socket;
  },
}));
