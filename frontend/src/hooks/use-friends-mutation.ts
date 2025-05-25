import { removeFriend } from "@/api/friends";
import {
  acceptRequest,
  cancelRequest,
  rejectRequest,
  sendRequest,
} from "@/api/requests";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useFriendsMutation() {
  const queryClient = useQueryClient();

  const removeFriendMutation = useMutation({
    mutationKey: ["remove_friend"],
    mutationFn: async (id: string) => {
      return await removeFriend({ id });
    },
    onSuccess: async () => {
      const { activeConversation, setActiveConversation } =
        useActiveConversation.getState();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["get_friends"] }),
        queryClient.invalidateQueries({ queryKey: ["get_requests"] }),
        queryClient.invalidateQueries({ queryKey: ["get_conversations"] }),
      ]);

      if (activeConversation) {
        setActiveConversation({
          ...activeConversation,
          inActiveParticipants: [...activeConversation.participants],
        });
      }
    },
  });
  const addFriendMutation = useMutation({
    mutationKey: ["add_friend"],
    mutationFn: async (data: {
      id: string;
      fullname: string;
      email: string;
      avatarUrl: string;
    }) => {
      const request = await sendRequest({ receiver: data.id });
      return request;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    },
  });

  const acceptFriendMutation = useMutation<
    void,
    Error,
    { id: string; senderId: string }
  >({
    mutationKey: ["accept_friend"],
    mutationFn: async ({ id, senderId }) => {
      await acceptRequest({ id, senderId });
    },
  });

  const rejectFriendMutation = useMutation({
    mutationKey: ["reject_friend"],
    mutationFn: async (id: string) => {
      await rejectRequest({ id });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    },
  });

  const cancelFriendMutation = useMutation({
    mutationKey: ["cancel_request"],
    mutationFn: async (id: string) => {
      await cancelRequest({ id });
    },
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["get_requests"] });
    },
  });

  return {
    addFriendMutation,
    removeFriendMutation,
    acceptFriendMutation,
    rejectFriendMutation,
    cancelFriendMutation,
  };
}

export default useFriendsMutation;
