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
import useCurrentUserMutation from "@/hooks/use-current-user-mutation";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";
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
  const currentUserQuery = useCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfileMutation } = useCurrentUserMutation();

  const save = async (values: SetProfileSchema) => {
    await updateProfileMutation.mutateAsync(values);
    setIsEditing(false);
  };

  const cancel = () => {
    setIsEditing(false);
  };

  const onEditbuttons: FormButton[] = [
    {
      name: "Cancel",
      isLoading: updateProfileMutation.isPending,
      action: cancel,
      variant: "outline",
      type: "reset",
    },
    {
      name: "Save",
      isLoading: updateProfileMutation.isPending,
      loadingIcon: <Loader2Icon className="animate-spin" />,
      notLoadingIcon: <CheckIcon />,
      type: "submit",
    },
  ];
  const buttons: FormButton[] = [
    { name: "Edit Profile", action: () => setIsEditing(true) },
  ];

  if (currentUserQuery.isPending) return <div>Loading...</div>;
  if (!currentUserQuery.data) return;

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
                email: currentUserQuery.data.email,
                fullname: currentUserQuery.data.fullname,
                bio: currentUserQuery.data.bio,
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
