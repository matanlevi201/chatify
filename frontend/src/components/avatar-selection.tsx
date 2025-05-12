import { CameraIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import { Separator } from "./ui/separator";
import { FormMessage } from "./ui/form";
import { useCurrentUser } from "@/hooks/use-current-user";

const DEFAULT_AVATARS = [
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
];

type Props = {
  name: string;
  disabled?: boolean;
};

function AvatarSelection({ name, disabled }: Props) {
  const { currentUser } = useCurrentUser();
  const { control, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState("");

  const handleFileChange = (file: Blob) => {
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    setValue(name, file, { shouldValidate: true });
  };

  const handleAvatarSelect = async (url: string) => {
    setAvatarUrl(url);
    const res = await fetch(url);
    const blob = await res.blob();
    const file = new File([blob], "avatar.png", { type: blob.type });
    setValue(name, file, { shouldValidate: true });
  };

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={() => (
        <div className="w-full flex flex-col items-center space-y-4">
          {disabled ? (
            <>
              <div>
                <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                  <AvatarImage
                    src={currentUser.avatarUrl || "/placeholder.svg"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-4xl">
                    {currentUser.fullname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold">{currentUser.fullname}</h2>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                  <AvatarImage
                    src={
                      avatarUrl || currentUser.avatarUrl || "/placeholder.svg"
                    }
                    alt="Profile"
                  />
                  <AvatarFallback className="text-2xl">
                    <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-md opacity-90 hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onChangeFile}
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label
                  htmlFor="avatar-selection"
                  className="text-sm font-medium block text-muted-foreground"
                >
                  Choose an avatar
                </Label>
                <div className="flex gap-2 flex-wrap" id="avatar-selection">
                  {DEFAULT_AVATARS.map((avatar, index) => (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "rounded-full overflow-hidden outline-2 outline-offset-2 transition-all",
                        avatarUrl === avatar
                          ? "outline-primary scale-105"
                          : "outline-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() => handleAvatarSelect(avatar)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={avatar}
                          alt={`Avatar option ${index + 1}`}
                        />
                        <AvatarFallback>{index + 1}</AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
                <FormMessage className="text-xs">
                  {control.getFieldState("avatar").error?.message}
                </FormMessage>
              </div>
            </>
          )}
          <Separator className="my-2" />
        </div>
      )}
    />
  );
}

export default AvatarSelection;
