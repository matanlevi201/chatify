import { memo } from "react";
import ActionEmoji from "./action-emoji";
import { useChatTextBoxState } from "./chat-text-box-store";
import ActionSend from "./action-send";
import ChatTextarea from "./chat-textarea";

function ChatTextBox() {
  const content = useChatTextBoxState((state) => state.content);

  return (
    <div className="flex flex-col group w-full bg-background border border-input focus-within:ring-2 focus-within:ring-primary/30 rounded-lg">
      {content.attachments?.length ? <div className="p-4"></div> : null}
      <ChatTextarea />
      <div className="p-2 flex justify-between border-t border-input/50 dark:bg-input/30">
        <div>
          <ActionEmoji />
        </div>
        <ActionSend />
      </div>
    </div>
  );
}

export default memo(ChatTextBox);
