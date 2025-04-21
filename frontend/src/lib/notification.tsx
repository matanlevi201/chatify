import ToastGeneric from "@/components/toasts/toast-generic";
import { toast } from "react-toastify";

export type NotificationMap = {
  generic: {
    type: "info" | "error" | "success";
    title?: string;
    description?: string;
  };
};

type NotificationName = keyof NotificationMap;

type NotificationSettings = {
  [K in NotificationName]: { name: K; props: NotificationMap[K] };
}[NotificationName];

export function notification(settings: NotificationSettings) {
  switch (settings.name) {
    case "generic":
      return toast(<ToastGeneric {...settings?.props} />, {
        closeButton: false,
        position: "bottom-right",
      });
    default:
      return;
  }
}
