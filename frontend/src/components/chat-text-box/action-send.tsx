import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSocketStore } from "@/stores/use-socket-store";
import { useChatTextBoxState } from "./chat-text-box-store";
import { useActiveConversation } from "@/stores/use-active-conversation";

function ActionSend() {
  const content = useChatTextBoxState((state) => state.content);
  const setContent = useChatTextBoxState((state) => state.setContent);
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const activeConversation = useActiveConversation(
    (state) => state.activeConversation
  );

  const sendMessage = () => {
    if (!socket || !isConnected || !activeConversation) return;
    socket.emit("message:send", {
      content: content.text,
      conversationId: activeConversation.id,
    });
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
