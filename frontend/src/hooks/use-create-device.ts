import { addDevice } from "@/api/devices";
import {
  arrayBufferToBase64,
  exportPublicKeyToBase64,
  generateDeviceId,
  generateRegistrationId,
  generateUserKeys,
} from "@/lib/crypto";
import { getItem, saveKeys } from "@/lib/indexed-db";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

function useCreateDevice() {
  const { isSignedIn } = useUser();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    const generate = async () => {
      const deviceId = await getItem<string>("deviceId");
      if (!deviceId) {
        try {
          setPending(true);
          const newDeviceId = generateDeviceId();
          const registrationId = generateRegistrationId();
          const { identityKeyPair, signedPreKeyPair, signedPreKeySignature } =
            await generateUserKeys();

          const identityPublicKey = await exportPublicKeyToBase64(
            identityKeyPair.publicKey
          );
          const signedPrePublicKey = await exportPublicKeyToBase64(
            signedPreKeyPair.publicKey
          );
          const signature = arrayBufferToBase64(signedPreKeySignature);

          const serverBundle = {
            deviceId: newDeviceId,
            registrationId,
            identityKey: identityPublicKey,
            signedPreKey: {
              keyId: 1,
              publicKey: signedPrePublicKey,
              signature,
            },
          };

          await saveKeys(
            newDeviceId,
            registrationId,
            identityKeyPair,
            signedPreKeyPair
          );
          await addDevice({ ...serverBundle });
        } catch (error) {
          console.error("Key generation failed:", error);
        } finally {
          setPending(false);
        }
      }
    };

    generate();
  }, [isSignedIn]);

  return { pending };
}

export default useCreateDevice;
