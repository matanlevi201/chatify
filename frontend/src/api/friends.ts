import { api } from "./api-client";

const BASE_URL = "/api/friends";

export const getFriends = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};
