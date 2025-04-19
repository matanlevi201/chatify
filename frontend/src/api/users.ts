import { api } from "./api-client";

const BASE_URL = "/api/users";

export const getCurrentUser = async () => {
  const response = await api.get(`${BASE_URL}`);
  return response.data;
};

export const searchUsers = async (query: string) => {
  const response = await api.get(`${BASE_URL}/search?q=${query}`);
  return response.data;
};

export const setProfile = async ({
  fullname,
  bio,
  avatar,
}: {
  fullname: string;
  bio?: string;
  avatar?: Blob;
}) => {
  const formData = new FormData();
  if (avatar) formData.append("avatar", avatar);
  formData.append("fullname", fullname);
  if (bio) formData.append("bio", bio);

  const response = await api.post(`${BASE_URL}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
