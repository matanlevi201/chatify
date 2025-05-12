import type { Request, Response } from "express";
import { findByClerkId, findById } from "../services/user.service";
import {
  createFriendRequest,
  findFriendRequests,
  findPendingRequestById,
  guardAcceptedFriendRequest,
  guardExistingFriendRequest,
  handleAcceptRequest,
  handleCancelRequest,
  handleRejectRequest,
} from "../services/requests.service";
import {
  publishAcceptRequest,
  publishCancelRequest,
  publishRejectRequest,
  publishSendRequest,
} from "../events/publishers";

export const getAllRequests = async (req: Request, res: Response) => {
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  const requests = await findFriendRequests(user.id);
  res.status(200).send(requests);
};

export const sendRequest = async (req: Request, res: Response) => {
  const { receiver: receiverId } = req.body;
  const clerkId = req.auth?.userId!;
  const [sender, receiver] = await Promise.all([
    findByClerkId(clerkId),
    findById(receiverId),
  ]);
  await guardExistingFriendRequest(sender.id, receiverId);
  const newRequest = await createFriendRequest(sender.id, receiver.id);
  publishSendRequest(receiver.clerkId, sender);
  res.status(201).send(newRequest);
};

export const rejectRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  const friendRequest = await handleRejectRequest(id, user.id);
  publishRejectRequest(friendRequest.sender.clerkId);
  res.status(200).send();
};

export const acceptRequest = async (req: Request, res: Response) => {
  const { id, senderId } = req.body;
  const clerkId = req.auth?.userId!;
  const [user, sender] = await Promise.all([
    findByClerkId(clerkId),
    findById(senderId),
  ]);
  const friendRequest = await findPendingRequestById(id, user.id, sender.id);
  const { conversationId } = await handleAcceptRequest(id, user.id, sender.id);
  publishAcceptRequest(
    friendRequest.sender,
    friendRequest.receiver,
    conversationId
  );
  res.status(200).send();
};

export const cancelRequest = async (req: Request, res: Response) => {
  const { id } = req.body;
  const clerkId = req.auth?.userId!;
  const user = await findByClerkId(clerkId);
  await guardAcceptedFriendRequest(id);
  const friendRequest = await handleCancelRequest(id, user.id);
  publishCancelRequest(friendRequest.receiver.clerkId);
  res.status(200).send();
};
