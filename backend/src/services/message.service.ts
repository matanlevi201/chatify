import type { ClientSession } from "mongoose";
import { Message, type PopulatedMessageDoc } from "../models/message";
import type { ConversationDoc } from "../models/conversation";
import type { UserDoc } from "../models/user";
import { transactionWrapper } from "./database.service";

export const handleMessageCreation = async (
  content: string,
  sender: UserDoc,
  conversation: ConversationDoc
) => {
  const createMessage = async (session: ClientSession) => {
    const newMessage = Message.build({
      sender: sender.id,
      content,
      conversation: conversation.id,
      readBy: [],
    });

    await newMessage.save({ session });
    const message = (await newMessage.populate([
      { path: "sender", options: { session } },
      { path: "readBy", options: { session } },
    ])) as PopulatedMessageDoc;
    conversation.lastMessage = message.id;
    conversation.participants.forEach((par) => {
      const participantId = par.toString();
      const unseenCount = conversation.unseenCounts.get(participantId) ?? 0;

      if (participantId !== sender.id) {
        conversation.unseenCounts.set(participantId, unseenCount + 1);
      }
    });
    await conversation.save({ session });
    return { message, unseenCounts: conversation.unseenCounts };
  };
  return await transactionWrapper<{
    message: PopulatedMessageDoc;
    unseenCounts: Map<string, number>;
  }>(createMessage);
};

export const markMessagesAsSeen = async (
  conversation: ConversationDoc,
  userId: string
) => {
  const mark = async (session: ClientSession) => {
    conversation.unseenCounts.set(userId, 0);
    const [{ modifiedCount }] = await Promise.all([
      Message.updateMany(
        {
          conversation: conversation.id,
          sender: { $ne: userId },
          readBy: { $ne: userId },
        },
        {
          $addToSet: { readBy: userId },
        },
        { session }
      ),
      conversation.save({ session }),
    ]);
    return { modifiedMessagesCount: modifiedCount };
  };
  return await transactionWrapper<{
    modifiedMessagesCount: number;
  }>(mark);
};
