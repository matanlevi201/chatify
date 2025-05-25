import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NavChatsItem from "./nav-chats-item";
import { useConversationsQuery } from "@/hooks/use-conversations-query";

function NavChats() {
  const conversations = useConversationsQuery();
  const { chatId } = useParams();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarGroupLabel className="flex justify-between">
          <span>Chats</span>
          <Button
            size="icon"
            variant="ghost"
            className="mt-1 h-auto w-auto p-2"
            onClick={() => {}}
          >
            <PlusIcon />
          </Button>
        </SidebarGroupLabel>

        {conversations.data
          ? conversations.data.map((item) => (
              <SidebarMenuItem key={item.id} className="flex items-center">
                <SidebarMenuButton
                  tooltip={item.name}
                  className={`px-2.5 py-7.5 ${
                    chatId === item.id ? "bg-muted" : ""
                  }`}
                  onClick={() => navigate(`/chat/${item.id}`)}
                >
                  <NavChatsItem conversation={item} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          : null}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavChats;
