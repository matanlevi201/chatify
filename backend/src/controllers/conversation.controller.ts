import type { Request, Response } from "express";
import { findByClerkId } from "../services/user.service";
import {
  findConversationById,
  findConversations,
  findMessagesByConversationId,
  formatConversation,
  guardIsParticipant,
} from "../services/conversation.service";
import { Conversation } from "../models/conversation";
import { User } from "../models/user";
import { publishNewGroupConversation } from "../events/publishers";
import { swapAvatarsByKeyId } from "../services/storage.service";
import { env } from "../config/env";

export const getConversations = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  const conversations = await findConversations(user.id);
  const result = conversations.map((conv) => formatConversation(conv, user.id));
  res.status(200).send(result);
};

export const conversationMessages = async (req: Request, res: Response) => {
  const { id } = req.params;
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  await guardIsParticipant(id, user.id);
  const conversation = await findConversationById(id);
  const messages = await findMessagesByConversationId(conversation.id);
  res.status(200).send(messages);
};

export const getConversation = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  const conversation = await findConversationById(req.params.id, true);
  res.status(200).send(formatConversation(conversation, user.id));
};

export const createGroupConversation = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const { name, participants } = req.body;
  const user = await findByClerkId(clerkId);
  const newConversation = Conversation.build({
    name,
    isGroup: true,
    participants: [...participants, user.id],
    inActiveParticipants: [],
  });
  await newConversation.save();
  if (req.file) {
    const { key } = await swapAvatarsByKeyId(newConversation.id, req.file);
    newConversation.avatarUrl = `${env.BACKEND_URL}/api/avatar/${key}`;
    await newConversation.save();
  }
  const users = await User.find({ _id: { $in: participants } })
    .select("clerkId")
    .lean();
  const usersIds = users.map((u) => u.clerkId);
  publishNewGroupConversation([...usersIds, clerkId], newConversation.id);
  res.status(200).send(newConversation.id);
};
