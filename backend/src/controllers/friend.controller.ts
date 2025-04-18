import type { Request, Response } from "express";
import { FriendRequest } from "../models/friend-request";
import { NotFoundError } from "../errors";
import { User } from "../models/user";

export const removeFriend = async (req: Request, res: Response) => {
  const { firendId } = req.body;
  const user = await User.findOne(
    { clerkId: req.auth?.userId },
    { _id: 1, friends: 1 }
  );
  const friend = await User.findOne({ _id: firendId }, { _id: 1, friends: 1 });
  if (!user || !friend) {
    throw new NotFoundError();
  }
  user.friends = user.friends.filter((id) => firendId === id);
  friend.friends = friend.friends.filter((id) => user.id === id);
  await Promise.all([user.save(), friend.save()]);
  await FriendRequest.deleteOne({
    $or: [
      { sender: user.id, receiver: firendId },
      { sender: firendId, receiver: user.id },
    ],
  });
  res.status(200).send();
};

export const getFriends = async (req: Request, res: Response) => {
  const user = await User.findOne(
    { clerkId: req.auth?.userId },
    { friends: 1 }
  ).populate("friends");
  if (!user) {
    throw new NotFoundError();
  }
  res.status(200).send(user?.friends);
};
