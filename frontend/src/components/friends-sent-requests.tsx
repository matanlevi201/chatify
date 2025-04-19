import { useRequestStore } from "@/stores/use-requests-store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { ClockIcon } from "lucide-react";
import { Badge } from "./ui/badge";

function SentRequestsRequests() {
  const { incomingRequests } = useRequestStore();
  const sentRequests = incomingRequests();
  return (
    <div className="w-full">
      <h3 className="text-md font-medium mb-2 flex items-center">
        sentRequests Requests
        <Badge variant="outline" className="ml-2">
          {sentRequests.length}
        </Badge>
      </h3>
      {!sentRequests.length ? (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="p-4 text-center text-muted-foreground">
            No sent requets
          </div>
        </div>
      ) : (
        sentRequests.map((request) => (
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
                onClick={() => console.log(request)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SentRequestsRequests;
