import { Field } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useFriendsQuery from "./use-friends-query";
import { useMemo } from "react";
import useConversationsMutation from "./use-conversations-mutation";
import AvatarWithStatus from "@/components/avatar-with-status";

const createGroupChatSchema = z.object({
  name: z.string().min(3, "Name must be minimum 3 chars"),
  participants: z
    .array(z.string())
    .nonempty("At least one participant is required"),
  avatar: z.string().optional(),
});

export type CreateGroupChatSchema = z.infer<typeof createGroupChatSchema>;

function useFormCreateGroupcChat(
  defaultValues?: Partial<CreateGroupChatSchema>
) {
  const friendsQuery = useFriendsQuery();
  const { createGroupConversationMutation } = useConversationsMutation();
  const form = useForm<CreateGroupChatSchema>({
    resolver: zodResolver(createGroupChatSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      participants: defaultValues?.participants ?? [],
      avatar: defaultValues?.avatar ?? undefined,
    },
  });

  const participantsOptions = useMemo(() => {
    if (!friendsQuery.data?.length) return [];
    return friendsQuery.data.map((f) => ({
      value: f.id,
      label: f.fullname,
      icon: () => (
        <AvatarWithStatus
          url={f.avatarUrl}
          name={f.fullname}
          className="size-8"
        />
      ),
    }));
  }, [friendsQuery.data]);

  const inputs: Record<
    keyof CreateGroupChatSchema,
    Field<CreateGroupChatSchema>
  > = {
    avatar: {
      name: "avatar",
      type: "avatar",
    },
    name: {
      name: "name",
      type: "text",
      label: "Group Name",
      placeholder: "Enter group name",
      description: "This is how others will infer the group",
    },
    participants: {
      name: "participants",
      type: "multi-select",
      label: "Select Friends",
      placeholder: "Selected friends",
      description: "Participants in the group",
      options: participantsOptions,
    },
  };

  const submit = async () => {
    const values = form.getValues();
    const { avatar, ...rest } = values;
    if (avatar) {
      const response = await fetch(avatar);
      const blob = await response.blob();
      const file = new File([blob], "avatar", { type: blob.type });
      await createGroupConversationMutation.mutateAsync({
        ...values,
        avatar: file,
      });
      return;
    }
    await createGroupConversationMutation.mutateAsync(rest);
  };

  return {
    inputs,
    form,
    submit,
    submitDetails: createGroupConversationMutation,
    createGroupChatSchema,
  };
}

export default useFormCreateGroupcChat;
