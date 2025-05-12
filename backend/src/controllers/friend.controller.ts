import type { Request, Response } from "express";
import {
  findByClerkId,
  findById,
  findByIdWithFriends,
} from "../services/user.service";
import { handleFriendRemovel } from "../services/friend.service";
import { publishFriendRemove } from "../events/publishers";

export const removeFriend = async (req: Request, res: Response) => {
  const { id } = req.body;
  const clerkId = req.auth?.userId!;
  const [user, friend] = await Promise.all([
    findByClerkId(clerkId),
    findById(id),
  ]);
  const { conversationId } = await handleFriendRemovel(user.id, friend.id);
  publishFriendRemove(clerkId, friend.clerkId, conversationId);
  res.status(200).send();
};

export const getFriends = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  const { friends } = await findByIdWithFriends(user.id);
  res.status(200).send(friends);
};
