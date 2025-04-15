"use client";

import { LogOutIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Button } from "./ui/button";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { user: u } = useUser();
  const { signOut } = useClerk();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-4 py-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={u?.imageUrl} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <Button
            onClick={() => signOut()}
            variant="ghost"
            size="icon"
            className="hover:cursor-pointer text-red-500 hover:text-red-500 hover:bg-red-500/15"
          >
            <LogOutIcon />
          </Button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
