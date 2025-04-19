import type { Request, Response } from "express";
import { deleteObject, getObject, postObject } from "../externals/storage";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../models/user";
import { env } from "../config/env";
import sharp from "sharp";
import { v4 } from "uuid";
import { Types } from "mongoose";

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

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  res.status(200).send(user);
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
  const { key } = req.params;
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  try {
    const stream = await getObject({
      fileKey: key ?? "",
    });

    res.setHeader("Content-Type", "image/jpeg");
    stream.pipe(res);
  } catch (err) {
    throw new NotFoundError();
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  const { q } = req.query;
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  const users = await User.aggregate([
    {
      $match: {
        $and: [
          {
            $or: [
              { fullname: { $regex: q, $options: "i" } },
              { email: { $regex: q, $options: "i" } },
            ],
          },
          { _id: { $ne: Types.ObjectId.createFromHexString(user.id) } },
        ],
      },
    },
    {
      $lookup: {
        from: "friendrequests",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      {
                        $eq: [
                          "$sender",
                          Types.ObjectId.createFromHexString(user.id),
                        ],
                      },
                      { $eq: ["$receiver", "$$userId"] },
                    ],
                  },
                  {
                    $and: [
                      {
                        $eq: [
                          "$receiver",
                          Types.ObjectId.createFromHexString(user.id),
                        ],
                      },
                      { $eq: ["$sender", "$$userId"] },
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: "friendRequest",
      },
    },
    {
      $project: {
        _id: 0,
        id: "$_id",
        fullname: 1,
        email: 1,
        avatarUrl: 1,
        friendStatus: {
          $cond: [
            { $gt: [{ $size: "$friendRequest" }, 0] },
            { $arrayElemAt: ["$friendRequest.status", 0] },
            "none",
          ],
        },
      },
    },
  ]);
  res.status(200).send(users);
};
