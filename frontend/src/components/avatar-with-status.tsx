import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { JSX } from "react";

interface AvatarWithStatusProps {
  url: string;
  name: string;
  status?: "online" | "offline" | "away";
  fallbackIcon?: JSX.Element;
  className?: string;
}
function AvatarWithStatus({
  url,
  name,
  status,
  fallbackIcon,
  className,
}: AvatarWithStatusProps) {
  return (
    <div className="relative inline-block">
      {status && (
        <span
          className={cn(
            "absolute top-0 right-0 z-10 size-2 rounded-full ring-2 ring-background",
            status === "online" && "bg-green-500",
            status === "offline" && "bg-gray-400",
            status === "away" && "bg-amber-500"
          )}
        />
      )}

      <Avatar className={`size-10 ${className}`}>
        <AvatarImage src={url ?? "/avatar-1.png"} />
        <AvatarFallback>{fallbackIcon ?? name.charAt(0)}</AvatarFallback>
      </Avatar>
    </div>
  );
}

export default AvatarWithStatus;
