import { notification } from "@/lib/notification";
import { useSocket } from "@/stores/use-socket-context";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useRequestListeners() {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("request:send", async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
      notification({
        name: "generic",
        props: {
          type: "info",
          title: "Friend Request",
          description: `${data.fromUser} wants to add you as a friend`,
        },
      });
    });

    socket.on("request:cancel", async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    });

    socket.on("request:reject", async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    });

    socket.on("request:accept", async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["get_friends"] });
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
      await queryClient.invalidateQueries({ queryKey: ["get_conversations"] });
      notification({
        name: "generic",
        props: {
          type: "success",
          title: "Friend Request",
          description: data.message,
        },
      });
    });

    return () => {
      socket.off("request:send");
      socket.off("request:cancel");
      socket.off("request:reject");
      socket.off("request:accept");
    };
  }, [socket, isConnected]);

  return null;
}
