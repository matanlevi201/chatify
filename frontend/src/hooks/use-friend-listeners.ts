import { useSocketStore } from "@/stores/use-socket-store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useFriendListeners() {
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("friend:remove", async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_friends"] });
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    });

    return () => {
      socket.off("friend:remove");
    };
  }, []);

  return null;
}
