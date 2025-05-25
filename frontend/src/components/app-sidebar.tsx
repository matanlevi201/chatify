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
import NavChats from "./nav-chats";
import useUserActivity from "@/hooks/use-user-activity";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";
import { useRequestsQuery } from "@/hooks/use-requests-query";
import { useNavigate } from "react-router-dom";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useUserActivity();
  const navigate = useNavigate();
  const currentUserQuery = useCurrentUserQuery();
  const requestsQuery = useRequestsQuery();

  if (!currentUserQuery.data) return;
  const incoming = requestsQuery.data?.filter(
    (req) =>
      req.receiver.id === currentUserQuery.data?.id && req.status === "pending"
  );

  const data = {
    user: {
      name: currentUserQuery.data.fullname,
      email: currentUserQuery.data.email,
      avatar: currentUserQuery.data.avatarUrl,
    },
    navs: [
      {
        name: "Friends",
        url: "/friends",
        icon: UsersIcon,
        updates: incoming?.length,
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
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/chatify.svg" className="size-8" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-bold text-xl">Chatify</span>
            </div>
          </div>

          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background gap-0">
        <NavMain navs={data.navs} />
        <NavChats />
      </SidebarContent>
      <Separator className="h-1" />
      <SidebarFooter className="bg-background">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
