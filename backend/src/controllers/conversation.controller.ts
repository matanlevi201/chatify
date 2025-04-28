import type { Request, Response } from "express";
import { Conversation } from "../models/conversation";
import { NotFoundError } from "../errors";
import { User } from "../models/user";

export const getConversations = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  const conversations = await Conversation.find({
    participants: user.id,
  }).populate("participants");
  res.status(200).send(conversations);
};
