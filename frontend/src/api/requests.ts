import { api } from "./api-client";

const BASE_URL = "/api/requests";

export const getRequests = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};
