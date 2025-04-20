import { useModalStore } from "@/stores/use-modal-store";
import ModalViewProfile from "./modal-view-profile";
import ModalConfirmation from "./modal-confirmation";

export function ModalManager() {
  const { settings } = useModalStore();

  switch (settings.name) {
    case "confirm":
      return <ModalConfirmation open={true} props={settings.props} />;
    case "view:profile":
      return <ModalViewProfile open={true} props={settings.props} />;
    default:
      return;
  }
}
