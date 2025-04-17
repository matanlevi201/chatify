import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "../config/env";
import type { Readable } from "stream";

export const r2Client = new S3Client({
  endpoint: env.BUCKET_ENDPOINT,
  region: "auto",
  credentials: {
    accessKeyId: env.COULDFLARE_ACCESS_KEY,
    secretAccessKey: env.COULDFLARE_SECRET_KEY,
  },
});

export const postObject = async ({
  fileKey,
  content,
  mimetype,
}: {
  fileKey: string;
  content: Buffer<ArrayBufferLike>;
  mimetype: string;
}) => {
  try {
    const uploadParams = {
      Bucket: env.BUCKET_NAME,
      Key: fileKey,
      Body: content,
      ContentType: mimetype,
    };

    const command = new PutObjectCommand({
      ...uploadParams,
      ACL: "public-read",
    });

    await r2Client.send(command);

    const url = `${env.BUCKET_ENDPOINT}/${env.BUCKET_NAME}/${fileKey}`;

    return url;
  } catch (error) {
    console.error("Error posting object from R2:", error);
    throw error;
  }
};

export const deleteObject = async ({ fileKey }: { fileKey: string }) => {
  try {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: fileKey,
      })
    );
  } catch (error) {
    console.error("Error deleting object from R2:", error);
    throw error;
  }
};

export const getObject = async ({ fileKey }: { fileKey: string }) => {
  try {
    const { Body } = await r2Client.send(
      new GetObjectCommand({
        Bucket: env.BUCKET_NAME,
        Key: fileKey,
      })
    );

    if (!Body || typeof Body === "string" || Body instanceof Uint8Array) {
      throw new Error("Unexpected Body format");
    }

    return Body as Readable;
  } catch (error) {
    console.error("Error fetching object from R2:", error);
    throw error;
  }
};
