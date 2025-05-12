import { CheckIcon, ChevronLast, Loader2Icon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import FormUpdateProfile, {
  Field,
  FormButton,
  SetProfileSchema,
} from "@/components/form-update-profile";
import { setProfile } from "@/api";
import { Button } from "@/components/ui/button";
import ToggleWrapper from "@/components/toggle-wrapper";
import { useCurrentUser } from "@/hooks/use-current-user";
import { setUserProfile } from "@/lib/query-current-user-utils";

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
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async (values: SetProfileSchema) => {
      return await setProfile({ ...values, fullname: values.fullname });
    },
    onSuccess(newData: SetProfileSchema) {
      setUserProfile(queryClient, newData);
      navigate("/");
    },
  });

  const saveAndContinue = async (formValues: SetProfileSchema) => {
    await mutateAsync(formValues);
  };

  const buttons: FormButton[] = [
    {
      name: "Continue to Chat",
      type: "submit",
      isLoading: isPending,
      loadingIcon: <Loader2Icon className="animate-spin" />,
      notLoadingIcon: <CheckIcon />,
      className: "w-full",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Set up your profile</CardTitle>
            <div>
              <ModeToggle />
              <ToggleWrapper msg="Skip for now">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigate("/")}
                >
                  <ChevronLast />
                </Button>
              </ToggleWrapper>
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
              fullname: currentUser.fullname,
              bio: currentUser.bio,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
export default ProfileSetup;
