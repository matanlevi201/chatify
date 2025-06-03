import { ModalMap, useModalStore } from "@/stores/use-modal-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { getUser } from "@/api";

interface ModalViewProfileProps {
  open: boolean;
  props: ModalMap["view:profile"];
}

const STATUS_COLOR = {
  online:
    "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 dark:text-green-400",
  away: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800 dark:text-yellow-400",
  offline:
    "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800 dark:text-gray-400",
};

function ModalViewProfile({ open, props }: ModalViewProfileProps) {
  const { closeModal } = useModalStore();
  const { data, isLoading, isError } = useQuery<{
    id: string;
    bio: string;
    email: string;
    status: "online" | "away" | "offline";
    fullname: string;
    avatarUrl: string;
    createdAt: Date;
    mutualFriends: number;
  }>({
    queryKey: ["get_user", props.userId],
    queryFn: async () => {
      const user = await getUser({ id: props.userId });
      return user;
    },
  });
  if (isLoading) return;
  if (isError) return;
  if (!data) return;
  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="max-w-xs flex flex-col items-center">
        <DialogHeader>
          <DialogTitle className="text-xl">Profile Information</DialogTitle>
        </DialogHeader>
        <Avatar className="h-24 w-24 border-4 border-background shadow-md rounded-full">
          <AvatarImage
            className="rounded-full"
            src={data.avatarUrl || "/placeholder.svg"}
            alt={data.fullname}
          />
          <AvatarFallback className="text-2xl rounded-full">
            {data.fullname.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{data.fullname}</h2>
          <span className="font-medium">{data.email}</span>
        </div>

        <div className="flex gap-1">
          <Badge variant="outline" className="font-normal">
            @{data.fullname}
          </Badge>
          <Badge
            variant="outline"
            className={`font-normal ${STATUS_COLOR[data.status]}`}
          >
            {data.status}
          </Badge>
        </div>

        {data.bio && (
          <p className="text-sm text-muted-foreground max-w-xs text-center">
            {data.bio}
          </p>
        )}

        <div className="float-right space-y-2">
          {data.createdAt && (
            <div className="flex items-center gap-3 text-sm">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Joined:</span>
              <span className="font-medium">
                {format(data.createdAt, "MMMM yyyy")}
              </span>
            </div>
          )}

          {data.mutualFriends !== undefined && (
            <div className="flex items-center gap-3 text-sm">
              <div className="h-4 w-4 flex items-center justify-center text-muted-foreground">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
              </div>
              <span className="text-muted-foreground">Mutual Friends:</span>
              <span className="font-medium">{data.mutualFriends}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalViewProfile;
