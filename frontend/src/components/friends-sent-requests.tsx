import { useRequestStore } from "@/stores/use-requests-store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { ClockIcon, Loader2Icon } from "lucide-react";
import { Badge } from "./ui/badge";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";
import { cancelRequest } from "@/api/requests";

function SentRequests() {
  const [sent, removeSentRequest] = useRequestStore(
    useShallow((state) => [state.sent, state.removeSentRequest])
  );
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["cancel_request"],
    mutationFn: async (id: string) => {
      await cancelRequest({ id });
      return id;
    },
    onSuccess(id) {
      removeSentRequest(id);
    },
  });
  return (
    <div className="w-full">
      <h3 className="text-md font-medium mb-2 flex items-center">
        Sent Requests
        <Badge variant="outline" className="ml-2">
          {sent.length}
        </Badge>
      </h3>
      {!sent.length ? (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="p-4 text-center text-muted-foreground">
            No sent requets
          </div>
        </div>
      ) : (
        sent.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-2 justify-between p-3 rounded-lg border hover:bg-muted/50 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={request.receiver.avatarUrl}
                  alt={request.receiver.fullname}
                />
                <AvatarFallback className="size-10 bg-background flex items-center justify-center">
                  {request.receiver.fullname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.receiver.fullname}</p>
                <p className="text-sm text-muted-foreground">
                  @{request.receiver.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                Pending
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={async () => await mutateAsync(request.id)}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  "Cancel"
                )}
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SentRequests;
