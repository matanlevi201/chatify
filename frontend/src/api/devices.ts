import { api } from "./api-client";

const BASE_URL = "/api/devices";

export const addDevice = async ({
  deviceId,
  registrationId,
  identityKey,
  signedPreKey,
}: {
  deviceId: string | undefined;
  registrationId: number;
  identityKey: string;
  signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
}) => {
  const response = await api.post(`${BASE_URL}`, {
    deviceId,
    registrationId,
    identityKey,
    signedPreKey,
  });
  return response.data;
};

export const getUserPublicBundle = async (userId: string) => {
  const response = await api.get(`${BASE_URL}/${userId}`);
  return response.data;
};
