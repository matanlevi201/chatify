import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import InitializeSocket from "@/components/initializers/initialize-socket";
import InitializeListeners from "@/components/initializers/initialize-listeners";
import { useConversations } from "@/hooks/use-conversations";
import { useCurrentUser } from "@/hooks/use-current-user";

function AppLayout() {
  useConversations();
  useCurrentUser();

  return (
    <InitializeSocket>
      <InitializeListeners>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </InitializeListeners>
    </InitializeSocket>
  );
}

export default AppLayout;
