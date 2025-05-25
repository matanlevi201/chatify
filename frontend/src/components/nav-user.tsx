import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { publishFriendOffline } from "@/events/pulishers";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { signOut } = useClerk();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-4 py-2">
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <Button
            onClick={async () => {
              await signOut();
              publishFriendOffline();
            }}
            variant="ghost"
            size="icon"
            className=" text-red-500 hover:text-red-500 hover:bg-red-500/15"
          >
            <LogOutIcon />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
