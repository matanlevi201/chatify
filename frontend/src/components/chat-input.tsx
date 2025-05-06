import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useSocketStore } from "@/stores/use-socket-store";

function ChatInput() {
  const { chatId } = useParams();
  const socket = useSocketStore((state) => state.socket);
  const isConnected = useSocketStore((state) => state.isConnected);
  const [content, setContent] = useState("");
  const [debouncedContent] = useDebounce(content, 600);
  const [isTyping, setIsTyping] = useState(false);

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    if (!socket || !isConnected) return;

    if (!isTyping) {
      socket.emit("typing:start", { conversationId: chatId ?? "" });
      setIsTyping(true);
    }
  };

  const sendMessage = () => {
    if (!socket || !isConnected || !chatId) return;

    socket.emit("message:send", { content, conversationId: chatId });
    setContent("");
  };

  useEffect(() => {
    if (!socket || !isConnected || !chatId) return;

    if (isTyping) {
      socket.emit("typing:end", { conversationId: chatId });
      setIsTyping(false);
    }
  }, [debouncedContent, socket, isConnected, chatId]);

  return (
    <>
      <Textarea
        value={content}
        onChange={handleOnChange}
        placeholder="Type a message..."
        className="resize-none [@media(max-width:500px)]:min-h-0 bg-background dark:bg-background max-h-[80px] [@media(max-width:500px)]:text-sm"
      />
      <div className=" flex gap-1">
        <Button
          size="icon"
          className="rounded-full size-10"
          onClick={sendMessage}
        >
          <SendIcon className="size-5" />
        </Button>
      </div>
    </>
  );
}

export default ChatInput;
