import { createGroupConversation } from "@/api/conversations";
import { useMutation } from "@tanstack/react-query";

function useConversationsMutation() {
  const createGroupConversationMutation = useMutation({
    mutationKey: ["create_group_conversation"],
    mutationFn: async ({
      name,
      participants,
      avatar,
    }: {
      name: string;
      participants: string[];
      avatar?: Blob;
    }) => {
      return await createGroupConversation({ name, participants, avatar });
    },
  });
  return { createGroupConversationMutation };
}

export default useConversationsMutation;
