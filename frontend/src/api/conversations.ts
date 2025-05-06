import { api } from "./api-client";

const BASE_URL = "/api/conversations";

export const getConversations = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};

export const conversationMessages = async (id: string) => {
  const response = await api.get(`${BASE_URL}/${id}`);
  return response.data;
};
