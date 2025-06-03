import sharp from "sharp";
import { v4 } from "uuid";
import { deleteObject, postObject } from "../externals/storage";
import { BadRequestError } from "../errors";
import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, or GIF allowed."));
    }
  },
});

export const swapAvatarsByKeyId = async (
  keyId: string,
  file: Express.Multer.File,
  prevKeyId?: string
) => {
  const { buffer, mimetype } = file;
  const processedImage = await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .toBuffer();

  const uniquePrefix = `${Date.now()}-${v4()}`;
  const key = `${uniquePrefix}-${keyId}.png`;

  const url = await postObject({
    fileKey: key,
    content: processedImage,
    mimetype: mimetype,
  });
  if (!url) {
    throw new BadRequestError("Failed to upload avatar");
  }
  if (prevKeyId) {
    await deleteObject({ fileKey: prevKeyId });
  }
  return { key };
};
