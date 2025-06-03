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
import { Button } from "@/components/ui/button";
import TooltipWrapper from "@/components/tooltip-wrapper";
import useFormUpdateProfile from "@/hooks/use-form-update-profile";
import { Form } from "@/components/ui/form";
import InputDefault from "@/components/input-default";
import InputAvatar from "@/components/input-avatar";

function ProfileSetup() {
  const navigate = useNavigate();
  const { inputs, form, submit, submitDetails } = useFormUpdateProfile();

  const saveAndContinue = async () => {
    await submit();
    navigate("/");
  };

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(saveAndContinue)}
              className="flex flex-col space-y-4"
            >
              <InputAvatar
                {...inputs.avatar}
                options={inputs.avatar.fileOptions}
                disabled={submitDetails.isPending}
              />
              <InputDefault
                {...inputs.fullname}
                disabled={submitDetails.isPending}
              />

              <Button
                type="submit"
                disabled={submitDetails.isPending}
                className="flex-1"
              >
                Continue to Chat
                {submitDetails.isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <CheckIcon />
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
export default ProfileSetup;
