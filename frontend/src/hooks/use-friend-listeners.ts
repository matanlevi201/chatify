import { useConversationsStore } from "@/stores/use-conversation-store";
import {
  ServerToClientEvents,
  useSocketStore,
} from "@/stores/use-socket-store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useFriendListeners() {
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const friendRemove: ServerToClientEvents["friend:remove"] = async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_friends"] });
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    };

    const friendOnline: ServerToClientEvents["friend:online"] = (data) => {
      const { setParticipantStatus } = useConversationsStore.getState();
      setParticipantStatus(data.friendId, "online");
    };

    const friendOffline: ServerToClientEvents["friend:offline"] = (data) => {
      const { setParticipantStatus } = useConversationsStore.getState();
      setParticipantStatus(data.friendId, "offline");
    };

    const friendAway: ServerToClientEvents["friend:away"] = (data) => {
      const { setParticipantStatus } = useConversationsStore.getState();
      setParticipantStatus(data.friendId, "away");
    };

    socket.on("friend:remove", friendRemove);
    socket.on("friend:online", friendOnline);
    socket.on("friend:offline", friendOffline);
    socket.on("friend:away", friendAway);

    return () => {
      socket.off("friend:remove", friendRemove);
      socket.off("friend:online", friendOnline);
      socket.off("friend:offline", friendOffline);
      socket.off("friend:away", friendAway);
    };
  }, []);

  return null;
}
