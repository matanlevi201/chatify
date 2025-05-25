import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";

export function NavMain({
  navs,
}: {
  navs: {
    name: string;
    url: string;
    icon: LucideIcon;
    updates?: number;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navs.map((item) => (
          <SidebarMenuItem key={item.name} className="flex items-center">
            {/* <div className=" bg-primary w-[2px] h-3/5"/> */}
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link to={item.url} className="px-4 py-5">
                <item.icon />
                <span className="font-semibold">{item.name}</span>
                {item.updates ? (
                  <Badge variant="default" className="ml-auto rounded-full">
                    {item.updates}
                  </Badge>
                ) : null}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
