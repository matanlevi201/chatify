import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useChatTextBoxState } from "./chat-text-box-store";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { publishMessageSend } from "@/events/pulishers";

function ActionSend() {
  const content = useChatTextBoxState((state) => state.content);
  const setContent = useChatTextBoxState((state) => state.setContent);
  const activeConversation = useActiveConversation(
    (state) => state.activeConversation
  );

  const sendMessage = () => {
    if (!activeConversation) return;
    publishMessageSend(content.text, activeConversation.id);
    setContent({ text: "", attachments: [] });
  };

  return (
    <>
      <Button size="icon" className="rounded-full" onClick={sendMessage}>
        <SendIcon className="size-5" />
      </Button>
    </>
  );
}

export default ActionSend;
