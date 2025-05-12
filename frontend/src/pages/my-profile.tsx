import { setProfile } from "@/api";
import AppHeader from "@/components/app-header";
import FormUpdateProfile, {
  Field,
  FormButton,
  SetProfileSchema,
} from "@/components/form-update-profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { setUserProfile } from "@/lib/query-current-user-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

const inputs: Field<SetProfileSchema>[] = [
  {
    name: "avatar",
    type: "avatar",
  },
  {
    type: "text",
    name: "email",
    label: "Email",
    placeholder: "your@email.com",
    readOnly: true,
    description: "Email cannot be changed",
  },
  {
    name: "fullname",
    type: "text",
    label: "Display Name",
    placeholder: "Enter your display name",
    description: "This is how others will see you in the chat",
  },
  {
    name: "bio",
    type: "textarea",
    label: "Bio",
    placeholder: "Tell us about yourself...",
  },
];

function MyProfile() {
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async (data: SetProfileSchema) => {
      return await setProfile({ ...data, fullname: data.fullname });
    },
    onSuccess(data: SetProfileSchema) {
      setIsEditing(false);
      setUserProfile(queryClient, data);
    },
  });

  const save = async (values: SetProfileSchema) => {
    await mutateAsync(values);
  };

  const cancel = () => {
    setIsEditing(false);
  };

  const onEditbuttons: FormButton[] = [
    {
      name: "Cancel",
      isLoading: isPending,
      action: cancel,
      variant: "outline",
      type: "reset",
    },
    {
      name: "Save",
      isLoading: isPending,
      loadingIcon: <Loader2Icon className="animate-spin" />,
      notLoadingIcon: <CheckIcon />,
      type: "submit",
    },
  ];
  const buttons: FormButton[] = [
    { name: "Edit Profile", action: () => setIsEditing(true) },
  ];

  return (
    <div className="h-full flex flex-col">
      <AppHeader>
        <div>My Profile</div>
      </AppHeader>
      <div className="grow flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              View and edit your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormUpdateProfile
              inputs={inputs}
              buttons={isEditing ? onEditbuttons : buttons}
              disabled={!isEditing}
              defaultValues={{
                email: currentUser.email,
                fullname: currentUser.fullname,
                bio: currentUser.bio,
              }}
              onSubmit={save}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MyProfile;
