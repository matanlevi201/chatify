import * as React from "react";
import { CircleUserIcon, UsersIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "./ui/separator";
import { useProfileStore } from "@/stores/use-profile-store";
import NavChats from "./nav-chats";
import { useQuery } from "@tanstack/react-query";

type Conversation = {
  id: string;
  name?: string;
  isGroup: boolean;
  avatarUrl?: string;
  participants: {
    id: string;
    fullname: string;
    avatarUrl: string;
    status: "online" | "offline" | "away";
  }[];
  lastMessage?: string;
  unseenMessagesCount?: number;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfileStore();
  const {
    data: conversations,
    isError,
    isLoading,
  } = useQuery<Conversation[]>({
    queryKey: ["get_conversations"],
    queryFn: async (): Promise<Conversation[]> => {
      const data: Conversation[] = [
        {
          id: "1",
          isGroup: false,
          participants: [
            {
              id: "123",
              fullname: "Full Name",
              avatarUrl: "/avatar-1.png",
              status: "online",
            },
          ],
          lastMessage: "LOREM INPUS DOLLOR...",
        },
        {
          id: "2",
          name: "Our Group",
          isGroup: true,
          participants: [
            {
              id: "123",
              fullname: "Full Name",
              avatarUrl: "/avatar-1/png",
              status: "online",
            },
          ],
          unseenMessagesCount: 2,
        },
      ];
      return data;
    },
    initialData: [],
  });

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
        <NavChats
          conversations={conversations}
          isLoading={isLoading}
          isError={isError}
        />
      </SidebarContent>
      <Separator className="h-1" />
      <SidebarFooter className="bg-background">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
