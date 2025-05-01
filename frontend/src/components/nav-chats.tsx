import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavChatsItem from "./nav-chats-item";
import { Conversation } from "@/stores/use-conversation-store";

interface NavChatsProps {
  conversations: Conversation[];
  isLoading: boolean;
  isError: boolean;
}

function NavChats({ conversations, isLoading, isError }: NavChatsProps) {
  const navigate = useNavigate();
  if (isLoading) return;
  if (isError) return;

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

        {conversations.map((item) => (
          <SidebarMenuItem key={item.id} className="flex items-center">
            <SidebarMenuButton
              tooltip={item.name}
              className="px-2.5 py-7.5"
              onClick={() => navigate(`/chat/${item.id}`)}
            >
              <NavChatsItem conversation={item} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NavChats;
