import type { AuthObject } from "@clerk/express";
import type { Socket } from "socket.io";

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
}
export interface ClientToServerEvents {
  "request:accept": (data: { as: string; we: string }) => void;
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
