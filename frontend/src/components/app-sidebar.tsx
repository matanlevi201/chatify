import * as React from "react";
import { CircleUserIcon, UsersIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "./ui/separator";
import { useProfileStore } from "@/stores/use-profile-store";
import NavChats from "./nav-chats";
import { useConversationsStore } from "@/stores/use-conversation-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfileStore();
  const conversations = useConversationsStore((state) => state.conversations);

  const data = {
    user: {
      name: profile.displayName,
      email: profile.email,
      avatar: profile.avatarUrl,
    },
    navs: [
      {
        name: "Friends",
        url: "/friends",
        icon: UsersIcon,
      },
      {
        name: "My Profile",
        url: "/profile",
        icon: CircleUserIcon,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background">
        <div className="flex items-center gap-2">
          <img src="/chatify.svg" className="size-8" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-xl">Chatify</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background gap-0">
        <NavMain navs={data.navs} />
        <NavChats conversations={conversations} />
      </SidebarContent>
      <Separator className="h-1" />
      <SidebarFooter className="bg-background">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
