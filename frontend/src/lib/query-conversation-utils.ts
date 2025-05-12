import { Conversation } from "@/hooks/use-conversations";
import { QueryClient } from "@tanstack/react-query";

export const addConversation = (
  queryClient: QueryClient,
  newConversation: Conversation
) => {
  queryClient.setQueryData<Conversation[]>(["get_conversations"], (old) => [
    newConversation,
    ...(old || []),
  ]);
};

export const updateConversation = (
  queryClient: QueryClient,
  id: string,
  updates: Partial<Conversation> = {}
) => {
  queryClient.setQueryData<Conversation[]>(["get_conversations"], (old) => {
    const oldConversations = old ?? [];
    const conversationIndex = oldConversations.findIndex(
      (convo) => convo.id === id
    );
    if (conversationIndex < 0) return;
    const updatedConversations = [...oldConversations];
    const updatedConversation = {
      ...updatedConversations[conversationIndex],
      ...updates,
    };
    updatedConversations[conversationIndex] = updatedConversation;
    return updatedConversations;
  });
};

export const markAsSeen = (
  queryClient: QueryClient,
  activeConversationId: string
) => {
  queryClient.setQueryData<Conversation[]>(["get_conversations"], (old) => {
    const oldConversations = old ?? [];
    const updatedConversations = oldConversations.map((convo) => {
      if (convo.id !== activeConversationId) return convo;
      return { ...convo, unseenMessagesCount: 0 };
    });

    return updatedConversations;
  });
};

export const setParticipantStatus = (
  queryClient: QueryClient,
  participantId: string,
  status: Conversation["participants"]["0"]["status"]
) => {
  queryClient.setQueryData<Conversation[]>(["get_conversations"], (old) => {
    const oldConversations = old ?? [];
    const updatedConversations = oldConversations.map((convo) => {
      const participantIndex = convo.participants.findIndex(
        (par) => par.id === participantId
      );

      if (participantIndex === -1) return convo;
      const participants = [...convo.participants];
      participants[participantIndex] = {
        ...participants[participantIndex],
        status,
      };
      const updatedConvo = { ...convo, participants };
      return updatedConvo;
    });
    return updatedConversations;
  });
};

export const getCurrentConversations = (queryClient: QueryClient) => {
  return queryClient.getQueryData<Conversation[]>(["get_conversations"]) ?? [];
};
