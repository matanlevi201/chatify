import { set, get } from "idb-keyval";

export async function getItem<T>(name: string): Promise<T | undefined> {
  return await get(name);
}

export async function loadDeviceId(): Promise<string | undefined> {
  return await get("deviceId");
}

export async function saveKeys(
  deviceId: string,
  registrationId: number,
  identityKeyPair: CryptoKeyPair,
  signedPreKeyPair: CryptoKeyPair
) {
  await set("deviceId", deviceId);
  await set("registrationId", registrationId);
  await set("identityKeyPari", identityKeyPair);
  await set("signedPreKeyPair", signedPreKeyPair);
}
