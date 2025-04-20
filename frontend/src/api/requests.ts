import { api } from "./api-client";

const BASE_URL = "/api/requests";

export const getRequests = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};

export const sendRequest = async ({ receiver }: { receiver: string }) => {
  const response = await api.post(`${BASE_URL}`, { receiver });
  return response.data;
};

export const acceptRequest = async ({ id }: { id: string }) => {
  const response = await api.put(`${BASE_URL}`, { id });
  return response.data;
};

export const rejectRequest = async ({ id }: { id: string }) => {
  const response = await api.delete(`${BASE_URL}`, { data: { id } });
  return response.data;
};

export const cancelRequest = async ({ id }: { id: string }) => {
  const response = await api.delete(`${BASE_URL}/cancel`, { data: { id } });
  return response.data;
};
