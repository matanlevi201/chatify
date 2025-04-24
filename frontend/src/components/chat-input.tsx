import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function ChatInput() {
  return (
    <div className="container max-w-3xl flex p-4 sticky bottom-0 items-center gap-2">
      <Textarea
        placeholder="Type a message..."
        className="resize-none [@media(max-width:500px)]:min-h-0 bg-background dark:bg-background max-h-[80px] [@media(max-width:500px)]:text-sm"
      />
      <div className=" flex gap-1">
        <Button
          size="icon"
          className="rounded-full size-10"
          onClick={() => console.log("send")}
        >
          <SendIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
