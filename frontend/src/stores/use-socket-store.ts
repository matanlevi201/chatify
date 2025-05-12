import { io, Socket } from "socket.io-client";
import { create } from "zustand";

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
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents> | null;

type SocketStore = {
  socket: SocketType;
  isConnected: boolean;
  connect: (token: string) => Promise<void>;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  isReady: false,

  connect: async (token: string) => {
    return new Promise((resolve) => {
      const newSocket = io("http://localhost:3000", {
        auth: { token },
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        set({
          socket: newSocket,
          isConnected: true,
        });
        resolve();
      });

      newSocket.on("disconnect", () => {
        set({
          socket: null,
          isConnected: false,
        });
      });
    });
  },

  disconnect: () => {
    set((state) => {
      state.socket?.disconnect();
      return {
        socket: null,
        isConnected: false,
        isReady: false,
      };
    });
  },
}));
