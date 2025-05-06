import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api";
import { useProfileStore } from "@/stores/use-profile-store";
import { useCurrentUserStore } from "@/stores/use-current-user";
import InitializeApp from "@/components/initializers/initialize-app";
import InitializeSocket from "@/components/initializers/initialize-socket";
import InitializeListeners from "@/components/initializers/initialize-listeners";

function AppLayout() {
  const { setProfile } = useProfileStore();
  const { setCurrentUser } = useCurrentUserStore();
  const { isError, isLoading } = useQuery({
    queryKey: ["get_current_user"],
    queryFn: async () => {
      const data = await getCurrentUser();
      setProfile({
        displayName: data.fullname,
        email: data.email,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
      });
      setCurrentUser({ id: data.id, email: data.email });
      return data;
    },
  });

  if (isLoading) return;
  if (isError) return;
  return (
    <InitializeApp>
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
    </InitializeApp>
  );
}

export default AppLayout;
