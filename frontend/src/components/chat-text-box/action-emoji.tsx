import { SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { useTheme } from "../theme-provider";
import { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import { useChatTextBoxState } from "./chat-text-box-store";

function ActionEmoji() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickAway<HTMLDivElement>(() => setIsOpen(false));

  const content = useChatTextBoxState((state) => state.content);
  const setContent = useChatTextBoxState((state) => state.setContent);
  const textareaRef = useChatTextBoxState((state) => state.textareaRef);

  const insertEmoji = (emoji: string) => {
    if (!textareaRef) return;

    const textarea = textareaRef;
    const cursorPos = textarea.selectionStart;
    const textBefore = content.text.substring(0, cursorPos);
    const textAfter = content.text.substring(cursorPos);

    const newValue = textBefore + emoji + textAfter;
    setContent({ text: newValue });

    textarea.focus();
    const newCursorPos = cursorPos + emoji.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  };

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <SmileIcon className="size-5.5" />
      </Button>
      {isOpen && (
        <div ref={ref} className="absolute z-50 top-0 -translate-y-full">
          <EmojiPicker
            width={300}
            height={300}
            theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
            onEmojiClick={(emojiData) => insertEmoji(emojiData.emoji)}
            emojiStyle={EmojiStyle.NATIVE}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </>
  );
}

export default ActionEmoji;
