import type { Request, Response } from "express";
import { findByClerkId } from "../services/user.service";
import {
  findConversationById,
  findConversations,
  findMessagesByConversationId,
  formatConversation,
  guardIsParticipant,
} from "../services/conversation.service";

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
