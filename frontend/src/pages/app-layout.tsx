import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api";
import { useProfileStore } from "@/stores/use-profile-store";

function AppLayout() {
  const { setProfile } = useProfileStore();
  const { isError, isLoading } = useQuery({
    queryKey: ["get_profile"],
    queryFn: async () => {
      const data = await getProfile();
      setProfile(data);
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
