import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

function ToggleWrapper({
  children,
  msg,
}: {
  children: ReactNode;
  msg: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{msg}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ToggleWrapper;
