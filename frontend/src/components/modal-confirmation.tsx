import { ModalMap, useModalStore } from "@/stores/use-modal-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

interface ModalConfirmationProps {
  open: boolean;
  props: ModalMap["confirm"];
}

function ModalConfirmation({ open, props }: ModalConfirmationProps) {
  const { closeModal, setActiveModal } = useModalStore();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      await props.callback();
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={closeModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title ?? "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>{props.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/70"
            onClick={async (e) => {
              e.preventDefault();
              await mutateAsync();
              setActiveModal("none", null);
            }}
          >
            {isPending ? <Loader2Icon className="animate-spin" /> : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ModalConfirmation;
