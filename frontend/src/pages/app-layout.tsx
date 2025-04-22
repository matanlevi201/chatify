import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api";
import { useProfileStore } from "@/stores/use-profile-store";
import { useCurrentUserStore } from "@/stores/use-current-user";
import { useRequestListeners } from "@/hooks/use-request-listeners";
import { useFriendListeners } from "@/hooks/use-friend-listeners";

function AppLayout() {
  useRequestListeners();
  useFriendListeners();
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AppLayout;
