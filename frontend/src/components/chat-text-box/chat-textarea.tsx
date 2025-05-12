import { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { useChatTextBoxState } from "./chat-text-box-store";
import { useSocketStore } from "@/stores/use-socket-store";
import { useDebounce } from "use-debounce";
import { useActiveConversation } from "@/stores/use-active-conversation";

function ChatTextarea() {
  const content = useChatTextBoxState((state) => state.content);
  const setContent = useChatTextBoxState((state) => state.setContent);

  const setTextareaRef = useChatTextBoxState((state) => state.setTextareaRef);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [debouncedContent] = useDebounce(content, 600);
  const [isTyping, setIsTyping] = useState(false);

  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const activeConversation = useActiveConversation(
    (state) => state.activeConversation
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent({ text: e.target.value });
    if (!socket || !isConnected || !activeConversation) return;
    if (!isTyping) {
      socket.emit("typing:start", { conversationId: activeConversation.id });
      setIsTyping(true);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      setTextareaRef(textareaRef.current);
    }
  }, [setTextareaRef]);

  useEffect(() => {
    if (!socket || !isConnected || !activeConversation) return;

    if (isTyping) {
      socket.emit("typing:end", { conversationId: activeConversation.id });
      setIsTyping(false);
    }
  }, [debouncedContent]);

  return (
    <Textarea
      autoFocus
      ref={textareaRef}
      value={content.text}
      onChange={handleOnChange}
      placeholder="Type a message..."
      className="resize-none min-h-0 max-h-[80px] !border-none !outline-none !shadow-none focus:!outline-none focus:!ring-0 py-3 px-4 pb-2 rounded-b-none"
    />
  );
}

export default ChatTextarea;
