import type { Request, Response } from "express";
import { deleteObject, getObject, postObject } from "../externals/storage";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../models/user";
import { env } from "../config/env";
import sharp from "sharp";
import { v4 } from "uuid";

const swapAvatars = async (
  userId: string,
  buffer: Buffer,
  mimetype: string,
  prevKey?: string
) => {
  const processedImage = await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .toBuffer();

  const uniquePrefix = `${Date.now()}-${v4()}`;
  const key = `${uniquePrefix}-${userId}.png`;

  const url = await postObject({
    fileKey: key,
    content: processedImage,
    mimetype: mimetype,
  });
  if (!url) {
    throw new BadRequestError("Failed to upload avatar");
  }
  if (prevKey) await deleteObject({ fileKey: prevKey });
  return { key };
};

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  res.status(200).send({
    displayName: user.fullname,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
  });
};

export const setProfile = async (req: Request, res: Response) => {
  const { fullname, bio } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  if (req.file) {
    const { key } = await swapAvatars(
      user?.id,
      req.file.buffer,
      req.file.mimetype,
      user.avatarKey
    );
    user.avatarUrl = `${env.BACKEND_URL}/api/users/profile/avatar/${key}`;
    user.avatarKey = key;
  }
  user.fullname = fullname;
  user.bio = bio;
  const updatedUser = await user.save();
  res.status(200).send({
    displayName: updatedUser.fullname,
    email: updatedUser.email,
    avatarUrl: updatedUser.avatarUrl,
    bio: updatedUser.bio,
  });
};

export const getAvatar = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  try {
    const stream = await getObject({
      fileKey: user?.avatarKey ?? "",
    });

    res.setHeader("Content-Type", "image/jpeg");
    stream.pipe(res);
  } catch (err) {
    throw new NotFoundError();
  }
};
