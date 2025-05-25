import { NotFoundError } from "../errors";
import {
  Conversation,
  type ConversationDoc,
  type PopulatedConversationDoc,
} from "../models/conversation";
import { Message } from "../models/message";

export const findConversations = async (userId: string) => {
  const conversations = await Conversation.find({ participants: userId })
    .populate("participants lastMessage inActiveParticipants")
    .lean<PopulatedConversationDoc[]>();
  return conversations;
};

export const findActiveConversationsIds = async (userId: string) => {
  const conversations = await Conversation.find({
    participants: userId,
    inActiveParticipants: { $ne: userId },
  })
    .select("_id")
    .lean();

  return conversations.map((conv) => conv._id.toString());
};

export const guardIsParticipant = async (id: string, userId: string) => {
  const conversation = await Conversation.findOne({
    _id: id,
    participants: userId,
  });
  if (!conversation) {
    throw new NotFoundError();
  }
};

export const guardIsActiveParticipant = async (id: string, userId: string) => {
  const conversation = await Conversation.findOne({
    _id: id,
    participants: userId,
    inActiveParticipants: { $ne: userId },
  });
  if (!conversation) {
    throw new NotFoundError();
  }
};

// Function overloads
export function findConversationById(
  id: string,
  populate: true
): Promise<PopulatedConversationDoc>;
export function findConversationById(
  id: string,
  populate?: false
): Promise<ConversationDoc>;
export async function findConversationById(id: string, populate?: boolean) {
  const conversation = await Conversation.findOne({ _id: id });
  if (!conversation) {
    throw new NotFoundError();
  }

  if (populate) {
    return (await conversation.populate(
      "participants lastMessage"
    )) as PopulatedConversationDoc;
  }

  return conversation as ConversationDoc;
}

export const findMessagesByConversationId = async (id: string) => {
  const messages = await Message.find({
    conversation: id,
  }).populate("sender readBy");
  return messages;
};

export const formatConversation = (
  conversation: PopulatedConversationDoc,
  userId?: string
) => {
  const unseenCounts = new Map(Object.entries(conversation.unseenCounts));
  const isInActive = conversation.inActiveParticipants.find((inactiveUser) =>
    conversation.participants.find((par) => par.id === inactiveUser.id)
  );
  return {
    id: conversation._id,
    name: conversation.name,
    isGroup: conversation.isGroup,
    avatarUrl: conversation.avatarUrl,
    participants: conversation.participants.map((p) => ({
      id: p._id,
      fullname: p.fullname,
      avatarUrl: p.avatarUrl,
      status: isInActive ? null : p.status,
    })),
    inActiveParticipants: conversation.inActiveParticipants.map((p) => ({
      id: p._id,
      fullname: p.fullname,
      avatarUrl: p.avatarUrl,
    })),
    lastMessage: conversation.lastMessage,
    unseenMessagesCount: userId ? unseenCounts.get(userId) : 0,
  };
};
