import { setProfile } from "@/api";
import AppHeader from "@/components/app-header";
import AvatarSelection from "@/components/avatar-selection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useProfileStore } from "@/stores/use-profile-store";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";

function MyProfile() {
  const { profile, setProfile: setGlobalProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState(false);

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatar, setAvatar] = useState<Blob>();
  const [bio, setBio] = useState(profile.bio);
  const isFormValid = displayName.trim().length >= 3;

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async () => {
      if (isFormValid) {
        return await setProfile({ avatar, fullname: displayName, bio });
      }
    },
    onSuccess(data) {
      setIsEditing(false);
      setGlobalProfile(data);
    },
  });

  const handleFileChange = (file: Blob) => {
    if (file) {
      setAvatar(file);
    }
  };

  const save = async () => {
    await mutateAsync();
  };

  const cancel = () => {
    setDisplayName(profile.displayName);
    setBio(profile.bio);
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
            <div className="flex flex-col items-center space-y-4">
              {isEditing ? (
                <AvatarSelection
                  handleFileChange={handleFileChange}
                  defaultValue={profile.avatarUrl}
                />
              ) : (
                <>
                  <div>
                    <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                      <AvatarImage
                        src={profile.avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                      />
                      <AvatarFallback className="text-4xl">
                        {profile.displayName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{profile.displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  disabled={!isEditing}
                  onChange={(v) => setDisplayName(v.target.value)}
                  name="displayName"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  disabled={!isEditing}
                  onChange={(v) => setBio(v.target.value)}
                  className={
                    !isEditing ? "bg-muted resize-none" : "resize-none"
                  }
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            {isEditing ? (
              <div className="flex ml-auto gap-2">
                <Button variant="outline" onClick={cancel}>
                  Cancel
                </Button>
                <Button disabled={!isFormValid} onClick={save}>
                  Save
                  {isPending ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <CheckIcon />
                  )}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="ml-auto">
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default MyProfile;
