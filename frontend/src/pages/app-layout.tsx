import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SocketProvider } from "@/components/socket-provider";
import { useCurrentUserQuery } from "@/hooks/use-current-user-query";

function AppLayout() {
  const currentUserQuery = useCurrentUserQuery();

  if (currentUserQuery.isPending) return <div>Loading current user...</div>;
  if (currentUserQuery.isError)
    return <div>{currentUserQuery.error.message}</div>;

  return (
    <SidebarProvider>
      <SocketProvider>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SocketProvider>
    </SidebarProvider>
  );
}

export default AppLayout;
