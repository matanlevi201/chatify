import { setParticipantStatus } from "@/lib/query-conversation-utils";
import { useActiveConversation } from "@/stores/use-active-conversation";
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
      const { activeConversation, setActiveConversation } =
        useActiveConversation.getState();
      await queryClient.invalidateQueries({ queryKey: ["get_friends"] });
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
      await queryClient.invalidateQueries({ queryKey: ["get_conversations"] });
      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          inActiveParticipants: [...activeConversation.participants],
        });
      }
    };

    const friendOnline: ServerToClientEvents["friend:online"] = (data) => {
      const { setActiveConversation, activeConversation } =
        useActiveConversation.getState();
      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          participants: activeConversation.participants.map((par) => {
            if (par.id !== data.friendId) return par;
            return { ...par, status: "online" };
          }),
        });
      }
      setParticipantStatus(queryClient, data.friendId, "online");
    };

    const friendOffline: ServerToClientEvents["friend:offline"] = (data) => {
      const { setActiveConversation, activeConversation } =
        useActiveConversation.getState();
      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          participants: activeConversation.participants.map((par) => {
            if (par.id !== data.friendId) return par;
            return { ...par, status: "offline" };
          }),
        });
      }
      setParticipantStatus(queryClient, data.friendId, "offline");
    };

    const friendAway: ServerToClientEvents["friend:away"] = (data) => {
      const { setActiveConversation, activeConversation } =
        useActiveConversation.getState();
      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          participants: activeConversation.participants.map((par) => {
            if (par.id !== data.friendId) return par;
            return { ...par, status: "away" };
          }),
        });
      }
      setParticipantStatus(queryClient, data.friendId, "away");
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
