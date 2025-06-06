import {
  ClockIcon,
  Loader2Icon,
  SearchIcon,
  UserIcon,
  UserPlusIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { useSearch } from "@/hooks/use-search";
import { searchUsers } from "@/api";
import { Badge } from "./ui/badge";
import { useModalStore } from "@/stores/use-modal-store";
import { useRequestsQuery } from "@/hooks/use-requests-query";
import useFriendsMutation from "@/hooks/use-friends-mutation";

type Friend = {
  id: string;
  fullname: string;
  email: string;
  avatarUrl: string;
  friendStatus: "pending" | "rejected" | "accepted" | "none";
};

function SearchUsers() {
  const requestsQuery = useRequestsQuery();
  const { setActiveModal } = useModalStore();
  const { addFriendMutation } = useFriendsMutation();
  const [result, setResult] = useState<Friend[]>([]);
  const { searchQuery, debouncedQuery, isSearching, setSearchQuery } =
    useSearch({
      callback: async () => {
        const data = await searchUsers(debouncedQuery);
        setResult(data);
      },
    });

  useEffect(() => {
    const requests = requestsQuery.data ?? [];
    const updatedResults = result.map((u) => {
      const req = requests.find(
        (req) => req.sender.id === u.id || req.receiver.id === u.id
      );
      u.friendStatus = req?.status ?? "none";
      return u;
    });
    setResult(updatedResults);
  }, [requestsQuery.data]);

  const RenderSwitch = ({ friend }: { friend: Friend }) => {
    switch (true) {
      case friend.friendStatus === "none":
        return (
          <Button
            size="sm"
            disabled={addFriendMutation.isPending}
            onClick={async () => await addFriendMutation.mutateAsync(friend)}
          >
            {addFriendMutation.isPending ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <UserPlusIcon className="h-4 w-4" />
            )}
            Add Friend
          </Button>
        );
      case friend.friendStatus === "pending":
        return (
          <Badge variant="secondary" className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">Add New Friends</h2>
      <div
        tabIndex={0}
        className="mb-4 relative outline-2 outline-offset-2 outline-transparent focus-within:outline-primary rounded-lg"
      >
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, username, or email..."
          className="pl-10 bg-muted/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isSearching ? (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="p-4 text-center text-muted-foreground flex justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        </div>
      ) : debouncedQuery.length ? (
        <ScrollArea className="h-72 w-full rounded-md border-b">
          {result.length ? (
            <div className="flex flex-col gap-2">
              {result.map((user, i) => (
                <div
                  key={`${user.id}_${i}`}
                  className="flex items-center gap-2 justify-between p-3 rounded-lg border hover:bg-muted/50 flex-wrap"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={user.avatarUrl} alt={user.fullname} />
                      <AvatarFallback className="size-10 bg-background flex items-center justify-center">
                        {user.fullname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.fullname}</p>
                      <p className="text-sm text-muted-foreground">
                        @{user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <RenderSwitch friend={user} />
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setActiveModal("view:profile", { userId: user.id })
                      }
                    >
                      <UserIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="relative w-32 h-32 mb-4">
                <img
                  src="/no-results.png"
                  alt="No results found"
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1">No results found</h3>
              {debouncedQuery ? (
                <p className="text-muted-foreground">
                  We couldn't find any users matching "
                  <span className="font-medium">{debouncedQuery}</span>"
                </p>
              ) : (
                <p className="text-muted-foreground">
                  {"Try searching for a name, username, or email"}
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      ) : null}
    </div>
  );
}

export default SearchUsers;
