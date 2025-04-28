import { clsx, type ClassValue } from "clsx";
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInWeeks,
} from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeShort(date: Date): string {
  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;

  const hours = differenceInHours(now, date);
  if (hours < 24) return `${hours}h`;

  const days = differenceInDays(now, date);
  if (days < 7) return `${days}d`;

  const weeks = differenceInWeeks(now, date);
  return `${weeks}w`;
}

export async function encryptWithAES(
  plainText: string,
  aesKey: Uint8Array<ArrayBuffer>
) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
  const key = await crypto.subtle.importKey(
    "raw",
    aesKey,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plainText)
  );

  return {
    iv: Array.from(iv),
    ciphertext: Array.from(new Uint8Array(encrypted)),
  };
}

export async function exportPublicKeyToPEM(publicKey: CryptoKey) {
  const spki = await crypto.subtle.exportKey("spki", publicKey);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
  const pem = `-----BEGIN PUBLIC KEY-----\n${b64
    .match(/.{1,64}/g)
    ?.join("\n")}\n-----END PUBLIC KEY-----`;
  return pem;
}
