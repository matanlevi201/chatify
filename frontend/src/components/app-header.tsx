import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

function AppHeader({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2 px-4 w-full">
        {isMobile && <SidebarTrigger className="-ml-1" />}
        <div className="mr-2 w-[1px] h-4 bg-secondary" />
        {children}
      </div>
    </header>
  );
}

export default AppHeader;
