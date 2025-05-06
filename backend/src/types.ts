import type { AuthObject } from "@clerk/express";
import type { Socket } from "socket.io";
import type { PopulatedMessageDoc } from "./models/message";

export interface ServerToClientEvents {
  "request:send": (data: {
    fromUser: string;
    avatarUrl: string;
    message: string;
  }) => void;
  "request:cancel": () => void;
  "request:reject": () => void;
  "request:accept": (data: { message: string }) => void;
  "friend:remove": () => void;
  "typing:start": (data: {
    conversationId: string;
    userId: string;
    fullname: string;
  }) => void;
  "typing:end": (data: { conversationId: string }) => void;
  "message:new": (data: {
    message: PopulatedMessageDoc;
    unseenCounts: Map<string, number>;
  }) => Promise<void> | void;
  "message:sent": (data: {
    message: PopulatedMessageDoc;
  }) => Promise<void> | void;
  "message:read": (data: {
    user: { id: string; fullname: string; avatarUrl: string };
  }) => Promise<void> | void;
}
export interface ClientToServerEvents {
  "conversation:join": (data: { id: string }) => Promise<void>;
  "conversation:leave": (data: { id: string }) => Promise<void>;
  "typing:start": (data: { conversationId: string }) => Promise<void> | void;
  "typing:end": (data: { conversationId: string }) => void;
  "message:send": (data: {
    content: string;
    conversationId: string;
  }) => Promise<void> | void;
  "message:seen": (data: { conversationId: string }) => Promise<void> | void;
}
declare global {
  namespace Express {
    interface Application {
      onlineUsers: Map<
        string,
        Socket<ClientToServerEvents, ServerToClientEvents>
      >;
    }
    interface Request {
      auth?: AuthObject;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user: {
      sub: string;
      email?: string;
      [key: string]: any;
    };
  }
}
