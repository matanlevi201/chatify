import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ReactNode } from "react";

function AppHeader({ children }: { children: ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2 px-4">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        <Separator orientation="vertical" className="mr-2 h-4" />
        {children}
      </div>
    </header>
  );
}

export default AppHeader;
