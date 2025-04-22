import { useSocket } from "@/stores/use-socket-context";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useFriendListeners() {
  const { socket, isConnected } = useSocket();
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
  }, [socket, isConnected]);

  return null;
}
