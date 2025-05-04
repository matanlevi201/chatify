import type { Request, Response } from "express";
import {
  Conversation,
  type PopulatedConversationDoc,
} from "../models/conversation";
import { NotFoundError } from "../errors";
import { User } from "../models/user";

export const getConversations = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId });
  if (!user) {
    throw new NotFoundError();
  }
  const conversations = await Conversation.find({ participants: user.id })
    .populate({
      path: "participants",
      select: "id fullname avatarUrl status",
    })
    .populate({
      path: "lastMessage",
      select: "id content createdAt",
    })
    .lean<PopulatedConversationDoc[]>();

  const result = conversations.map((conv) => ({
    id: conv._id,
    name: conv.name,
    isGroup: conv.isGroup,
    avatarUrl: conv.avatarUrl,
    participants: conv.participants.map((p) => ({
      id: p._id,
      fullname: p.fullname,
      avatarUrl: p.avatarUrl,
      status: p.status,
    })),
    lastMessage: conv.lastMessage,
    unseenMessagesCount: conv.unseenCounts?.[user.id] ?? 0,
  }));
  res.status(200).send(result);
};
