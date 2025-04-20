import { useRequestStore } from "@/stores/use-requests-store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { acceptRequest, rejectRequest } from "@/api/requests";
import { useShallow } from "zustand/shallow";
import { useMutation } from "@tanstack/react-query";

function IncomingRequests() {
  const [incoming, removeIncomingRequest] = useRequestStore(
    useShallow((state) => [state.incoming, state.removeIncomingRequest])
  );
  const { mutateAsync: acceptFriend, isPending: acceptPending } = useMutation({
    mutationKey: ["accept_friend"],
    mutationFn: async (id: string) => {
      await acceptRequest({ id });
      return id;
    },
    onSuccess(id) {
      removeIncomingRequest(id);
    },
  });

  const { mutateAsync: rejectFriend, isPending: rejectPending } = useMutation({
    mutationKey: ["reject_friend"],
    mutationFn: async (id: string) => {
      await rejectRequest({ id });
      return id;
    },
    onSuccess(id) {
      removeIncomingRequest(id);
    },
  });

  return (
    <div className="w-full">
      <h3 className="text-md font-medium mb-2 flex items-center">
        Incoming Requests
        <Badge variant="outline" className="ml-2">
          {incoming.length}
        </Badge>
      </h3>
      {!incoming.length ? (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="p-4 text-center text-muted-foreground">
            No incoming requets
          </div>
        </div>
      ) : (
        incoming.map((request) => (
          <div
            key={request.id}
            className="flex items-center gap-2 justify-between p-3 rounded-lg border hover:bg-muted/50 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={request.sender.avatarUrl}
                  alt={request.sender.fullname}
                />
                <AvatarFallback className="size-10 bg-background flex items-center justify-center">
                  {request.sender.fullname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{request.sender.fullname}</p>
                <p className="text-sm text-muted-foreground">
                  @{request.sender.email}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={rejectPending}
                onClick={async () => await rejectFriend(request.id)}
              >
                {rejectPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <XIcon className="h-4 w-4" />
                )}
                Decline
              </Button>
              <Button
                size="sm"
                disabled={acceptPending}
                onClick={async () => await acceptFriend(request.id)}
              >
                {acceptPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <CheckIcon className="h-4 w-4" />
                )}
                Accept
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default IncomingRequests;
