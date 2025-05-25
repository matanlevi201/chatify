import { CheckIcon, ChevronLast, Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useNavigate } from "react-router-dom";
import FormUpdateProfile, {
  Field,
  FormButton,
  SetProfileSchema,
} from "@/components/form-update-profile";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/tooltip-wrapper";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";
import useCurrentUserMutation from "@/hooks/use-current-user-mutation";

const inputs: Field<SetProfileSchema>[] = [
  {
    name: "avatar",
    type: "avatar",
  },
  {
    name: "fullname",
    type: "text",
    label: "Display Name",
    placeholder: "Enter your display name",
    description: "This is how others will see you in the chat",
  },
];

function ProfileSetup() {
  const navigate = useNavigate();
  const currentUserQuery = useCurrentUserQuery();
  const { updateProfileMutation } = useCurrentUserMutation();

  const saveAndContinue = async (formValues: SetProfileSchema) => {
    await updateProfileMutation.mutateAsync(formValues);
    navigate("/");
  };

  const buttons: FormButton[] = [
    {
      name: "Continue to Chat",
      type: "submit",
      isLoading: updateProfileMutation.isPending,
      loadingIcon: <Loader2Icon className="animate-spin" />,
      notLoadingIcon: <CheckIcon />,
      className: "w-full",
    },
  ];

  if (currentUserQuery.isPending) return <div>Loading...</div>;
  if (!currentUserQuery.data) return;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Set up your profile</CardTitle>
            <div>
              <ModeToggle />
              <TooltipWrapper msg="Skip for now">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate("/")}
                >
                  <ChevronLast />
                </Button>
              </TooltipWrapper>
            </div>
          </div>
          <CardDescription>
            Personalize your profile before entering the chat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormUpdateProfile
            inputs={inputs}
            buttons={buttons}
            onSubmit={saveAndContinue}
            defaultValues={{
              fullname: currentUserQuery.data.fullname,
              bio: currentUserQuery.data.bio,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
export default ProfileSetup;
