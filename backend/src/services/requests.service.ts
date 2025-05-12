import type { ClientSession, ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../errors";
import {
  FriendRequest,
  RequestStatus,
  type PopulatedFriendRequestDoc,
} from "../models/friend-request";
import mongoose from "mongoose";
import { User } from "../models/user";
import { Conversation, type ConversationDoc } from "../models/conversation";
import { transactionWrapper } from "./database.service";

export const findFriendRequests = async (userId: string) => {
  return await FriendRequest.find({
    $or: [{ sender: userId }, { receiver: userId }],
  }).populate("sender receiver");
};

export const guardExistingFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  const existingFriendRequest = await FriendRequest.findOne({
    sender: senderId,
    receiver: receiverId,
  });
  if (existingFriendRequest) {
    throw new BadRequestError("Friend request is already exists");
  }
};

export const guardAcceptedFriendRequest = async (id: string) => {
  const existingFriendRequest = await FriendRequest.findOne({
    _id: id,
    status: RequestStatus.ACCEPTED,
  });
  if (existingFriendRequest) {
    throw new BadRequestError("Friend request is already accepted");
  }
};

export const createFriendRequest = async (
  senderId: ObjectId,
  receiverId: ObjectId
) => {
  const newRequest = FriendRequest.build({
    sender: senderId,
    receiver: receiverId,
  });
  await newRequest.save();
  await newRequest.populate("sender receiver");
  return newRequest;
};

export const handleRejectRequest = async (id: string, userId: ObjectId) => {
  const friendRequest = (await FriendRequest.findOneAndDelete({
    _id: id,
    receiver: userId,
    status: RequestStatus.PENDING,
  }).populate("sender")) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new BadRequestError("Failed to delete friend request");
  }
  return friendRequest;
};

export const handleCancelRequest = async (id: string, userId: ObjectId) => {
  const friendRequest = (await FriendRequest.findOneAndDelete({
    _id: id,
    sender: userId,
    status: RequestStatus.PENDING,
  }).populate("receiver")) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new BadRequestError("Failed to delete friend request");
  }
  return friendRequest;
};

export const findPendingRequestById = async (
  id: string,
  userId: ObjectId,
  senderId: ObjectId
) => {
  const friendRequest = (await FriendRequest.findOne({
    _id: id,
    sender: senderId,
    receiver: userId,
    status: RequestStatus.PENDING,
  }).populate("sender receiver")) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new NotFoundError();
  }
  return friendRequest;
};

export const handleAcceptRequest = async (
  id: string,
  userId: string,
  senderId: string
) => {
  const addFriend = async (session: ClientSession) => {
    let conversation: ConversationDoc | null =
      await Conversation.findOneAndUpdate(
        {
          participants: { $all: [userId, senderId] },
          $expr: { $eq: [{ $size: "$participants" }, 2] },
          inActiveParticipants: { $all: [userId, senderId] },
        },
        {
          $pull: {
            inActiveParticipants: { $in: [userId, senderId] },
          },
        },
        {
          new: true,
          session,
        }
      );

    if (!conversation) {
      conversation = Conversation.build({
        isGroup: false,
        participants: [userId, senderId],
        inActiveParticipants: [],
      });
      await conversation.save({ session });
    }

    await Promise.all([
      User.updateOne(
        { _id: userId },
        { $addToSet: { friends: senderId } },
        { session }
      ),
      User.updateOne(
        { _id: senderId },
        { $addToSet: { friends: userId } },
        { session }
      ),
      FriendRequest.updateOne(
        { _id: id },
        { status: RequestStatus.ACCEPTED },
        { session }
      ),
    ]);
    return { conversationId: conversation.id };
  };
  return await transactionWrapper<{ conversationId: string }>(addFriend);
};
