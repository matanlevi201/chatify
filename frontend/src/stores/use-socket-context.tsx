import { useAuth } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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
  "typing:end": (data: { conversationId: string }) => Promise<void> | void;
}

export interface ClientToServerEvents {
  "conversation:join": (data: { id: string }) => void;
  "conversation:leave": (data: { id: string }) => void;
  "typing:start": (data: { conversationId: string }) => Promise<void> | void;
  "typing:end": (data: { conversationId: string }) => Promise<void> | void;
}

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket<ServerToClientEvents> | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    const connectSocket = async () => {
      const token = await getToken();
      if (!token) return;

      const newSocket = io("http://localhost:3000", {
        auth: { token },
        withCredentials: true,
      });

      newSocket.on("connect", () => {
        setSocket(newSocket);
        setIsConnected(true);
      });
      newSocket.on("disconnect", () => {
        setSocket(null);
        setIsConnected(false);
      });
    };

    connectSocket();

    return () => {
      socket?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
