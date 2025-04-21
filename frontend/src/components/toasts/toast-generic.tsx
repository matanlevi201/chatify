import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

const MAPPER = {
  info: {
    defaultTitle: "Info",
    background: "bg-muted-foreground",
    defaultDescription: "lalal",
  },
  error: {
    defaultTitle: "Error",
    background: "bg-red-400",
    defaultDescription: "Something went wrong ❌",
  },
  success: {
    defaultTitle: "Success",
    background: "bg-primary",
    defaultDescription: "Action executed successfully ✨",
  },
};

function ToastGeneric({
  type,
  title,
  description,
  closeToast,
}: {
  type: "info" | "error" | "success";
  title?: string;
  description?: string;
  closeToast?: () => void;
}) {
  return (
    <Alert className="relative p-0 border-10 border-transparent flex rounded-sm">
      <div
        className={`absolute w-[3px] h-full rounded-sm ${MAPPER[type].background}`}
      />
      <div className="flex-1 px-4">
        <AlertTitle>{title ?? MAPPER[type].defaultTitle}</AlertTitle>

        <AlertDescription>
          {description ?? MAPPER[type].defaultDescription}
        </AlertDescription>
      </div>
      <Button
        size="icon"
        onClick={closeToast}
        className="group absolute top-0 right-0 ml-4 h-auto w-auto bg-transparent hover:bg-transparent hover:cursor-pointer shadow-none"
      >
        <XIcon
          className="w-4 h-4 text-muted-foreground group-hover:text-foreground"
          strokeWidth={2}
        />
      </Button>
    </Alert>
  );
}

export default ToastGeneric;
