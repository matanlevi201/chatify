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
import { getProfile } from "@/api";
import { useQuery } from "@tanstack/react-query";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    isError,
    isLoading,
    data: userData,
  } = useQuery({
    queryKey: ["get_profile"],
    queryFn: async () => {
      return await getProfile();
    },
  });

  if (isLoading) return;
  if (isError) return;

  const data = {
    user: {
      name: userData.fullname,
      email: userData.email,
      avatar: userData.avatarUrl,
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
          <img src="/chatify.svg" className="size-10" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-bold text-xl">Chatify</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain navs={data.navs} />
      </SidebarContent>
      <Separator className="h-1" />
      <SidebarFooter className="bg-background">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
