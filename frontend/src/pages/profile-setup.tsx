"use client";

import type React from "react";

import { useState } from "react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import AvatarSelection from "@/components/avatar-selection";
import { setProfile } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [avatar, setAvatar] = useState<Blob>();
  const isFormValid = displayName.trim().length >= 3 && avatar;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async () => {
      if (isFormValid) {
        await setProfile({ avatar, fullname: displayName });
      }
    },
    onSuccess() {
      navigate("/");
    },
  });

  const handleFileChange = (file: Blob) => {
    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Set up your profile</CardTitle>
            <ModeToggle />
          </div>
          <CardDescription>
            Personalize your profile before entering the chat
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <AvatarSelection handleFileChange={handleFileChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-sm font-medium">
                Display Name
              </Label>
              <Input
                id="display-name"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-background"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                This is how others will see you in the chat
              </p>
            </div>
          </CardContent>
        </form>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!isFormValid || isPending}
            onClick={handleSubmit}
          >
            Continue to Chat
            {isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <CheckIcon />
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
export default ProfileSetup;
