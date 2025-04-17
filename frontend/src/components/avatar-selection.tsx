import { CameraIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const DEFAULT_AVATARS = ["/avatar-1.png", "avatar-2.png", "avatar-3.png"];

function AvatarSelection({
  handleFileChange,
  defaultValue,
}: {
  handleFileChange: (url: Blob) => void;
  defaultValue?: string;
}) {
  const [avatarUrl, setAvatarUrl] = useState(defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      handleFileChange(file);
    }
  };

  const handleAvatarSelect = async (url: string) => {
    setAvatarUrl(url);
    const res = await fetch(url);
    const blob = await res.blob();
    handleFileChange(blob);
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-background shadow-md">
          <AvatarImage
            src={avatarUrl || defaultValue || "/placeholder.svg"}
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
          onChange={onChange}
        />
      </div>

      <div className="w-full">
        <Label
          htmlFor="avatar-selection"
          className="text-sm font-medium mb-2 block text-muted-foreground"
        >
          Choose an avatar
        </Label>
        <div className="flex gap-2" id="avatar-selection">
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
                  src={avatar || "/placeholder.svg"}
                  alt={`Avatar option ${index + 1}`}
                />
                <AvatarFallback>{index + 1}</AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AvatarSelection;
