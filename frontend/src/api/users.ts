import { api } from "./api-client";

const BASE_URL = "/api/users";

export const setProfile = async ({
  avatar,
  fullname,
}: {
  avatar: Blob;
  fullname: string;
}) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  formData.append("fullname", fullname);

  const response = await api.post(`${BASE_URL}/profile`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(`${BASE_URL}/profile`);
  return response.data;
};
