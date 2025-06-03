import { useModalStore } from "@/stores/use-modal-store";
import ModalViewProfile from "./modal-view-profile";
import ModalConfirmation from "./modal-confirmation";
import ModalCreateGroupChat from "./modal-create-group-chat";

export function ModalManager() {
  const { settings } = useModalStore();

  switch (settings.name) {
    case "confirm":
      return <ModalConfirmation open={true} props={settings.props} />;
    case "view:profile":
      return <ModalViewProfile open={true} props={settings.props} />;
    case "create:group:chat":
      return <ModalCreateGroupChat open={true} props={settings.props} />;
    default:
      return;
  }
}
