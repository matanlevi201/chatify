import { api } from "./api-client";

const BASE_URL = "/api/conversations";

export const getConversations = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};

export const conversationMessages = async (id: string) => {
  const response = await api.get(`${BASE_URL}/${id}/messages`);
  return response.data;
};

export const getConversation = async (id: string) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const createGroupConversation = async ({
  name,
  participants,
  avatar,
}: {
  name: string;
  participants: string[];
  avatar?: Blob;
}) => {
  const formData = new FormData();
  formData.append("name", name);
  participants.forEach((participant) => {
    formData.append("participants[]", participant);
  });
  if (avatar) formData.append("avatar", avatar);

  const response = await api.post(`${BASE_URL}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
