import { CameraIcon, CloudUploadIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormMessage } from "./ui/form";
import { cn, convertToFile } from "@/lib/utils";

type Props = {
  name: string;
  disabled?: boolean;
  options?: string[];
};

function InputAvatar({ name, disabled, options = [] }: Props) {
  const { control, setValue, getValues } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedOption, setSelectedOption] = useState("");

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setValue(name, url, { shouldValidate: true });
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState }) => (
        <div className="w-full flex flex-col items-center space-y-4">
          <div className={`relative ${disabled ? "" : "group"}`}>
            {disabled && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center z-10" />
            )}
            <Avatar
              className="h-24 w-24 border-4 border-background shadow-md group-hover:cursor-pointer"
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <AvatarImage src={getValues()[name]} alt="Profile" />
              <AvatarFallback className="text-2xl border-2 border-foreground/50 border-dashed bg-accent/40 group-hover:border-foreground/70 group-hover:bg-accent transition-all duration-200">
                <CloudUploadIcon className="h-10 w-10 scale-75 group-hover:scale-90 transition-scale duration-200" />
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              disabled={disabled}
              className={`absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-md opacity-90 group-hover:opacity-100 transition-opacity duration-200 group-hover:cursor-pointer ${
                disabled ? "bg-primary/15" : ""
              }`}
              onClick={() => !disabled && fileInputRef.current?.click()}
            >
              <CameraIcon className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              disabled={disabled}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files?.[0])}
            />
          </div>

          {!disabled && (
            <div className="flex gap-2 flex-wrap" id="avatar-selection">
              {options.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "rounded-full overflow-hidden outline-2 outline-offset-2 transition-all",
                    selectedOption === avatar
                      ? "outline-primary scale-105"
                      : "outline-transparent hover:border-muted-foreground/30"
                  )}
                  onClick={async () => {
                    setSelectedOption(avatar);
                    const file = await convertToFile(avatar);
                    handleFileChange(file);
                  }}
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
          )}
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </div>
      )}
    />
  );
}

export default InputAvatar;
