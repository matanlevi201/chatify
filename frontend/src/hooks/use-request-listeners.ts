import { getRequests } from "@/api/requests";
import { notification } from "@/lib/notification";
import { useRequestStore } from "@/stores/use-requests-store";
import { useSocket } from "@/stores/use-socket-context";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function useRequestListeners() {
  const setRequests = useRequestStore(useShallow((state) => state.setRequests));
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("request:send", async (data) => {
      const requests = await getRequests();
      setRequests(requests);
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
      const requests = await getRequests();
      setRequests(requests);
    });

    socket.on("request:reject", async () => {
      const requests = await getRequests();
      setRequests(requests);
    });

    socket.on("request:accept", async (data) => {
      const requests = await getRequests();
      setRequests(requests);
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
