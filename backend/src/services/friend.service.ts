import { FriendRequest } from "../models/friend-request";
import { User } from "../models/user";
import type { ClientSession } from "mongoose";
import { transactionWrapper } from "./database.service";
import { Conversation } from "../models/conversation";
import { NotFoundError } from "../errors";

export const handleFriendRemovel = async (id: string, friendId: string) => {
  const removeFriend = async (session: ClientSession) => {
    const [conversation] = await Promise.all([
      Conversation.findOneAndUpdate(
        {
          participants: { $all: [id, friendId] },
          $expr: { $eq: [{ $size: "$participants" }, 2] },
        },
        { $set: { inActiveParticipants: [id, friendId] } },
        { session }
      ),
      User.updateOne(
        { _id: id },
        { $pull: { friends: friendId } },
        { session }
      ),
      User.updateOne(
        { _id: friendId },
        { $pull: { friends: id } },
        { session }
      ),
      FriendRequest.deleteOne(
        {
          $or: [
            { sender: id, receiver: friendId },
            { sender: friendId, receiver: id },
          ],
        },
        { session }
      ),
    ]);
    return { conversationId: conversation?.id };
  };
  return await transactionWrapper<{ conversationId: string | null }>(
    removeFriend
  );
};

export const guardIsFriend = async (userId: string, friendId: string) => {
  const user = await User.findOne({
    _id: userId,
    participants: friendId,
  });
  if (!user) {
    throw new NotFoundError();
  }
};
