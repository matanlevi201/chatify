import type { Request, Response } from "express";
import { FriendRequest, RequestStatus } from "../models/friend-request";
import { BadRequestError, NotFoundError } from "../errors";
import { User } from "../models/user";

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

// Common approaches in enterprise chat apps:
//     Hard Block (One-Time Rejection)
//     After user B rejects the request, user A cannot send another request.
//     This avoids spamming and respects user B's decision.
//     Example: Some internal enterprise tools used in large orgs take this stricter approach for professionalism.
export const sendRequest = async (req: Request, res: Response) => {
  const { receiver } = req.body;
  const sender = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!sender) {
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
  res.status(201).send(newRequest);
};

export const rejectRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!user) {
    throw new NotFoundError();
  }
  const friendRequest = await FriendRequest.findOne({
    _id: id,
    receiver: user.id,
    status: RequestStatus.PENDING,
  });
  if (!friendRequest) {
    throw new NotFoundError();
  }
  friendRequest.status = RequestStatus.REJECTED;
  await friendRequest.save();
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
  const friendRequest = await FriendRequest.findOne({
    _id: id,
    receiver: user.id,
    status: RequestStatus.PENDING,
  });
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
  res.status(200).send();
};
