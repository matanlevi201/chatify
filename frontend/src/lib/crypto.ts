export function generateDeviceId() {
  return crypto.randomUUID();
}

export function generateRegistrationId() {
  return Math.floor(Math.random() * 0xffff);
}

export async function exportPublicKeyToBase64(publicKey: CryptoKey) {
  const rawKey = await crypto.subtle.exportKey("raw", publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(rawKey)));
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generateUserKeys() {
  const identityKeyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"]
  );

  const signedPreKeyPair = await crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"]
  );

  const signedPreKeyPublic = await crypto.subtle.exportKey(
    "raw",
    signedPreKeyPair.publicKey
  );

  const signedPreKeySignature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    identityKeyPair.privateKey,
    signedPreKeyPublic
  );

  return {
    identityKeyPair,
    signedPreKeyPair,
    signedPreKeySignature,
  };
}

export async function importPublicKeyFromBase64(base64: string) {
  const rawKey = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "raw",
    rawKey,
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    []
  );
}

export async function deriveSessionKey(
  privateKey: CryptoKey,
  recipientSignedPreKeyPublicKey: CryptoKey
) {
  const sharedSecret = await crypto.subtle.deriveBits(
    {
      name: "ECDH",
      public: recipientSignedPreKeyPublicKey,
    },
    privateKey,
    256
  );

  return crypto.subtle.importKey(
    "raw",
    sharedSecret,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
}
