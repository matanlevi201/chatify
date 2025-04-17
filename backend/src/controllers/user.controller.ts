import type { Request, Response } from "express";
import { deleteObject, getObject, postObject } from "../externals/storage";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../models/user";
import { env } from "../config/env";
import sharp from "sharp";
import { v4 } from "uuid";

export const getProfile = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  res.status(200).send({
    fullname: user.fullname,
    email: user.email,
    avatarUrl: user.avatarUrl,
  });
};

export const setProfile = async (req: Request, res: Response) => {
  const { fullname } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  const uniquePrefix = `${Date.now()}-${v4()}`;
  const key = `${uniquePrefix}-${user?.id}.png`;
  const processedImage = await sharp(req.file?.buffer)
    .resize(256, 256, { fit: "cover" })
    .toFormat("png")
    .toBuffer();
  const url = await postObject({
    fileKey: key,
    content: processedImage,
    mimetype: req.file?.mimetype!,
  });
  if (!url) {
    throw new BadRequestError("Failed to upload avatar");
  }
  const updatedUser = await User.findByIdAndUpdate(user?.id, {
    avatarUrl: `${env.BACKEND_URL}/api/users/profile/avatar/${user?.id}`,
    avatarKey: key,
    fullname,
  });
  if (!updatedUser) {
    await deleteObject({ fileKey: key });
    throw new BadRequestError("Failed to set profile");
  }
  if (user?.avatarKey) {
    await deleteObject({ fileKey: user.avatarKey });
  }
  res.status(200).send({ id: user?.id });
};

export const getAvatar = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findOne({ id: userId });
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
