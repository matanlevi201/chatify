import { memo } from "react";
import ActionEmoji from "./action-emoji";
import { useChatTextBoxState } from "./chat-text-box-store";
import ActionSend from "./action-send";
import ChatTextarea from "./chat-textarea";
import { useActiveConversation } from "@/stores/use-active-conversation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserXIcon } from "lucide-react";

function ChatTextBox() {
  const { currentUser } = useCurrentUser();
  const activeConversation = useActiveConversation(
    (state) => state.activeConversation
  );
  const content = useChatTextBoxState((state) => state.content);

  if (!activeConversation) return;

  if (
    activeConversation.inActiveParticipants.find(
      ({ id }) => id === currentUser.id
    )
  )
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-card rounded-lg border p-4 flex items-center gap-3">
          <div className="bg-input rounded-full p-2 flex-shrink-0">
            <UserXIcon size={20} className="text-zinc-500" />
          </div>
          <p className="text-zinc-400 text-sm">
            You can no longer send messages in this conversation because you are
            no longer friends with the participants.
          </p>
        </div>
      </div>
    );

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
