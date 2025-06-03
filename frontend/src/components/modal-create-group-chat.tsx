import { ModalMap, useModalStore } from "@/stores/use-modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { CheckIcon, Loader2Icon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import useFormCreateGroupcChat from "@/hooks/use-form-create-group-chat";
import { Form } from "./ui/form";
import InputAvatar from "./input-avatar";
import InputDefault from "./input-default";
import InputMultiSelect from "./input-multi-select";
import { Button } from "./ui/button";

interface ModalCreateGroupChatProps {
  open: boolean;
  props: ModalMap["create:group:chat"];
}

function ModalCreateGroupChat({ open, props }: ModalCreateGroupChatProps) {
  const { closeModal } = useModalStore();
  const { inputs, form, submit, submitDetails } = useFormCreateGroupcChat(
    props ?? undefined
  );

  const save = async () => {
    await submit();
    closeModal();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal} modal={false}>
      <div
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        )}
      />
      <DialogContent className="flex flex-col">
        <DialogHeader className="text-left">
          <div className="flex items-center">
            <DialogTitle className="text-xl flex items-center">
              <UsersIcon className="h-5 w-5 mr-2" />
              Create Group Chat
            </DialogTitle>
          </div>
          <DialogDescription>
            Create a group chat with multiple friends
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(save)}
            className="flex flex-col space-y-4"
          >
            <InputAvatar
              {...inputs.avatar}
              options={[]}
              disabled={submitDetails.isPending}
            />
            <InputDefault {...inputs.name} disabled={submitDetails.isPending} />
            <InputMultiSelect
              {...inputs.participants}
              disabled={submitDetails.isPending}
            />

            <Button
              type="submit"
              disabled={submitDetails.isPending}
              className="flex-1"
            >
              {props ? "Update Group" : "Create Group"}
              {submitDetails.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <CheckIcon />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ModalCreateGroupChat;
