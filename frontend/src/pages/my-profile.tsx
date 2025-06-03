import AppHeader from "@/components/app-header";
import AvatarWithStatus from "@/components/avatar-with-status";
import InputAvatar from "@/components/input-avatar";
import InputDefault from "@/components/input-default";
import InputTextarea from "@/components/input-textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";
import useFormUpdateProfile from "@/hooks/use-form-update-profile";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

function MyProfile() {
  const currentUserQuery = useCurrentUserQuery();
  const [isEditing, setIsEditing] = useState(false);
  const { inputs, form, submit, submitDetails } = useFormUpdateProfile();

  if (currentUserQuery.isPending) return <div>Loading...</div>;
  if (!currentUserQuery.data) return;

  const save = async () => {
    await submit();
    setIsEditing(false);
  };

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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(save)}
                className="flex flex-col space-y-4"
              >
                {!isEditing ? (
                  <AvatarWithStatus
                    url={currentUserQuery.data.avatarUrl}
                    name={currentUserQuery.data.fullname}
                    className="size-28 m-auto border-4 border-background shadow-md group-hover:cursor-pointer"
                  />
                ) : (
                  <InputAvatar
                    {...inputs.avatar}
                    options={inputs.avatar.fileOptions}
                    disabled={!isEditing || submitDetails.isPending}
                  />
                )}

                <InputDefault
                  {...inputs.fullname}
                  disabled={!isEditing || submitDetails.isPending}
                />
                <InputDefault
                  {...inputs.email}
                  readOnly={true}
                  disabled={true}
                />
                <InputTextarea
                  {...inputs.bio}
                  disabled={!isEditing || submitDetails.isPending}
                />

                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="flex-1"
                      variant="outline"
                      onClick={() => {
                        form.reset();
                        setIsEditing(false);
                      }}
                      disabled={submitDetails.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitDetails.isPending}
                      className="flex-1"
                    >
                      Save
                      {submitDetails.isPending ? (
                        <Loader2Icon className="animate-spin" />
                      ) : (
                        <CheckIcon />
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MyProfile;
