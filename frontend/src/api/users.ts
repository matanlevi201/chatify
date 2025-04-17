import { api } from "./api-client";

const BASE_URL = "/api/users";

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

export const getProfile = async () => {
  const response = await api.get(`${BASE_URL}/profile`);
  return response.data;
};
