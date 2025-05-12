import { User, type UserUpdateAttrs } from "../models/user";
import type { Request, Response } from "express";
import { getObject } from "../externals/storage";
import { NotFoundError } from "../errors";
import { env } from "../config/env";
import { Types } from "mongoose";
import {
  findByClerkId,
  getUserProfileView,
  swapAvatarsByClerkId,
  updateByClerkId,
} from "../services/user.service";

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await findByClerkId(req.auth?.userId!);
  res.status(200).send(user);
};

export const setProfile = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const { fullname, bio } = req.body;
  const updates: Partial<UserUpdateAttrs> = { fullname, bio };
  if (req.file) {
    const { key } = await swapAvatarsByClerkId(clerkId, req.file);
    updates.avatarUrl = `${env.BACKEND_URL}/api/users/profile/avatar/${key}`;
    updates.avatarKey = key;
  }
  const updatedUser = await updateByClerkId(clerkId, updates);
  res.status(200).send({
    fullname: updatedUser.fullname,
    avatarUrl: updatedUser.avatarUrl,
    bio: updatedUser.bio,
  });
};

export const getAvatar = async (req: Request, res: Response) => {
  const { key } = req.params;
  await findByClerkId(req.auth?.userId!);
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
  const user = await findByClerkId(req.auth?.userId!);
  const users = await User.aggregate([
    // Step 1: Match users based on query and exclude current user
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
    // Step 2: Lookup friend requests
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
      // Step 3: Project the desired fields
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

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const clerkId = req.auth?.userId!;
  const userWithMutualCount = await getUserProfileView(clerkId, id);
  res.status(200).send(userWithMutualCount);
};
