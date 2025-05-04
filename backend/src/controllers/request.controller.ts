import type { Request, Response } from "express";
import {
  FriendRequest,
  RequestStatus,
  type PopulatedFriendRequestDoc,
} from "../models/friend-request";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../models/user";
import { Conversation } from "../models/conversation";

export const getAllRequests = async (req: Request, res: Response) => {
  const user = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!user) {
    throw new NotFoundError();
  }
  const requests = await FriendRequest.find({
    $or: [{ sender: user.id }, { receiver: user.id }],
  })
    .populate("sender", "id fullname email avatarUrl")
    .populate("receiver", "id fullname email avatarUrl");
  res.status(200).send(requests);
};

export const sendRequest = async (req: Request, res: Response) => {
  const { receiver } = req.body;
  const sender = await User.findOne(
    { clerkId: req.auth?.userId },
    { _id: 1, fullname: 1, avatarUrl: 1 }
  );
  const targetUser = await User.findOne({ _id: receiver }, { clerkId: 1 });
  if (!sender || !targetUser) {
    throw new NotFoundError();
  }
  const existingFriendRequest = await FriendRequest.findOne({
    sender: sender.id,
    receiver,
  });
  if (existingFriendRequest) {
    throw new BadRequestError("Friend request is already exists");
  }
  const newRequest = FriendRequest.build({ sender: sender.id, receiver });
  await newRequest.save();
  await newRequest.populate([
    { path: "sender", select: "id fullname email avatarUrl" },
    { path: "receiver", select: "id fullname email avatarUrl" },
  ]);
  const onlineUsers = req.app.onlineUsers;
  const targetSocket = onlineUsers.get(targetUser.clerkId);
  if (targetSocket) {
    targetSocket.emit("request:send", {
      fromUser: sender.fullname,
      avatarUrl: sender.avatarUrl,
      message: "New Friend Request",
    });
  }
  res.status(201).send(newRequest);
};

export const rejectRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!user) {
    throw new NotFoundError();
  }
  const friendRequest = (await FriendRequest.findOneAndDelete({
    _id: id,
    receiver: user.id,
    status: RequestStatus.PENDING,
  }).populate({
    path: "sender",
    select: "clerkId",
  })) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new NotFoundError();
  }
  const onlineUsers = req.app.onlineUsers;
  const targetSocket = onlineUsers.get(friendRequest.sender.clerkId);
  if (targetSocket) {
    targetSocket.emit("request:reject");
  }
  res.status(200).send();
};

export const acceptRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findOne(
    { clerkId: req.auth?.userId },
    { _id: 1, friends: 1 }
  );
  if (!user) {
    throw new NotFoundError();
  }
  const friendRequest = (await FriendRequest.findOne({
    _id: id,
    receiver: user.id,
    status: RequestStatus.PENDING,
  }).populate([
    {
      path: "sender",
      select: "clerkId",
    },
    {
      path: "receiver",
      select: "clerkId",
    },
  ])) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new NotFoundError();
  }
  const sender = await User.findOne(
    { _id: friendRequest.sender },
    { friends: 1 }
  );
  if (!sender) {
    throw new BadRequestError("Request is malformed.");
  }
  sender.friends.push(user.id);
  user.friends.push(sender.id);
  friendRequest.status = RequestStatus.ACCEPTED;
  await Promise.all([sender.save(), user.save(), friendRequest.save()]);
  const conversation = Conversation.build({
    isGroup: false,
    participants: [user.id, sender.id],
  });
  await conversation.save();
  const onlineUsers = req.app.onlineUsers;
  const senderSocket = onlineUsers.get(friendRequest.sender.clerkId);
  const receiverSocket = onlineUsers.get(friendRequest.receiver.clerkId);
  if (senderSocket) {
    senderSocket.emit("request:accept", {
      message: `You and ${sender.fullname} are now friends`,
    });
  }
  if (receiverSocket) {
    receiverSocket.emit("request:accept", {
      message: `You and ${user.fullname} are now friends`,
    });
  }
  res.status(200).send();
};

export const cancelRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!user) {
    throw new NotFoundError();
  }
  const friendRequest = (await FriendRequest.findOneAndDelete({
    _id: id,
    sender: user.id,
    status: RequestStatus.PENDING,
  }).populate({
    path: "receiver",
    select: "clerkId",
  })) as PopulatedFriendRequestDoc | null;
  if (!friendRequest) {
    throw new NotFoundError();
  }
  const onlineUsers = req.app.onlineUsers;
  const targetSocket = onlineUsers.get(friendRequest.receiver.clerkId);
  if (targetSocket) {
    targetSocket.emit("request:cancel");
  }
  res.status(200).send();
};
