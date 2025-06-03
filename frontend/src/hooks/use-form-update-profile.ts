import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUserQuery } from "./use-current-user-query";
import useCurrentUserMutation from "./use-current-user-mutation";
import { useEffect } from "react";
import { Field } from "@/lib/types";

const updateProfileSchema = z.object({
  fullname: z.string().min(3, "Name must be minimum 3 chars"),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

function useFormUpdateProfile() {
  const currentUserQuery = useCurrentUserQuery();
  const { updateProfileMutation } = useCurrentUserMutation();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullname: "",
      avatar: undefined,
      email: undefined,
      bio: "",
    },
  });

  useEffect(() => {
    if (currentUserQuery.data) {
      form.reset({
        fullname: currentUserQuery.data.fullname ?? "",
        avatar: currentUserQuery.data.avatarUrl ?? undefined,
        email: currentUserQuery.data.email ?? undefined,
        bio: currentUserQuery.data.bio ?? "",
      });
    }
  }, [currentUserQuery.data, form]);

  const inputs: Record<
    keyof UpdateProfileSchema,
    Field<UpdateProfileSchema>
  > = {
    avatar: {
      name: "avatar",
      type: "avatar",
      fileOptions: [
        "avatar-1.png",
        "avatar-2.png",
        "avatar-3.png",
        "avatar-4.png",
        "avatar-5.png",
        "avatar-6.png",
        "avatar-7.png",
        "avatar-8.png",
        "avatar-9.png",
        "avatar-10.png",
        "avatar-11.png",
        "avatar-12.png",
        "avatar-13.png",
      ],
    },
    email: {
      type: "text",
      name: "email",
      label: "Email",
      placeholder: "your@email.com",
      readOnly: true,
      description: "Email cannot be changed",
    },
    fullname: {
      name: "fullname",
      type: "text",
      label: "Display Name",
      placeholder: "Enter your display name",
      description: "This is how others will see you in the chat",
    },
    bio: {
      name: "bio",
      type: "textarea",
      label: "Bio",
      placeholder: "Tell us about yourself...",
    },
  };

  const submit = async () => {
    const values = form.getValues();
    const { avatar, ...rest } = values;
    if (avatar && avatar !== currentUserQuery.data?.avatarUrl) {
      const response = await fetch(avatar);
      const blob = await response.blob();
      const file = new File([blob], "avatar", { type: blob.type });
      await updateProfileMutation.mutateAsync({ ...values, avatar: file });
      return;
    }
    await updateProfileMutation.mutateAsync(rest);
  };

  return {
    inputs,
    form,
    submit,
    updateProfileSchema,
    submitDetails: updateProfileMutation,
  };
}

export default useFormUpdateProfile;
