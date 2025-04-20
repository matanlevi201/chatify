import { MoreVerticalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends, removeFriend } from "@/api/friends";
import { useModalStore } from "@/stores/use-modal-store";
import { useState } from "react";
import { getRequests } from "@/api/requests";
import { useRequestStore } from "@/stores/use-requests-store";
import { useShallow } from "zustand/shallow";

function AllFriends() {
  const queryClient = useQueryClient();
  //  dropdownmenu overly conflicts with dialog overlay due to the async nature of dropdownmenu
  const [setRequests] = useRequestStore(
    useShallow((state) => [state.setRequests])
  );
  const [callback, setCallback] = useState({ run: () => {} });
  const { setActiveModal } = useModalStore();
  const {
    data: friends,
    isError,
    isLoading,
  } = useQuery<
    { id: string; fullname: string; email: string; avatarUrl: string }[]
  >({
    queryKey: ["get_friends"],
    queryFn: async () => {
      const data = await getFriends();
      return data;
    },
    initialData: [],
  });

  const { mutateAsync } = useMutation({
    mutationKey: ["remove_friend"],
    mutationFn: async (id: string) => {
      return await removeFriend({ id });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get_friends"] });
      const requests = await getRequests();
      setRequests(requests);
    },
  });

  if (isLoading) return;
  if (isError) return;

  return (
    <div className="w-full">
      <h3 className="text-md font-medium mb-2 flex items-center">
        Your Friends
      </h3>
      {!friends.length ? (
        <div className="mt-2 border rounded-md overflow-hidden">
          <div className="p-4 text-center text-muted-foreground">
            Add friends and start chatify !
          </div>
        </div>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center gap-2 justify-between p-3 rounded-lg border hover:bg-muted/50 flex-wrap"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage src={friend.avatarUrl} alt={friend.fullname} />
                <AvatarFallback className="size-10 flex items-center justify-center">
                  {friend.fullname.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{friend.fullname}</p>
                <p className="text-sm text-muted-foreground">@{friend.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Button size="sm" variant="ghost">
                Message
              </Button>
              <DropdownMenu
                onOpenChange={(isOpen) => {
                  if (!isOpen) callback.run();
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() =>
                      setCallback({
                        run: () =>
                          setActiveModal("view:profile", { userId: friend.id }),
                      })
                    }
                  >
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      setCallback({
                        run: () =>
                          setActiveModal("confirm", {
                            description: `You will no longer be able to communicate, but you can always send
            another request later if needed.`,
                            callback: async () => await mutateAsync(friend.id),
                          }),
                      })
                    }
                    className="text-destructive"
                  >
                    Remove Friend
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AllFriends;
