import { create } from "zustand";

type ChatTextBoxContent = {
  text: string;
  attachments?: File[];
};

interface ChatTextBoxState {
  textareaRef: HTMLTextAreaElement | null;
  content: ChatTextBoxContent;
  setTextareaRef: (textareaRef: HTMLTextAreaElement) => void;
  setContent: (content: Partial<ChatTextBoxContent>) => void;
}

export const useChatTextBoxState = create<ChatTextBoxState>((set, get) => ({
  textareaRef: null,
  content: { text: "", voice: null, attachments: [] },
  setTextareaRef: (textareaRef: HTMLTextAreaElement) =>
    set(() => ({ textareaRef })),
  setContent: (content: Partial<ChatTextBoxContent>) =>
    set(() => ({ content: { ...get().content, ...content } })),
}));
