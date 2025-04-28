import type { Request, Response } from "express";
import { User } from "../models/user";
import { NotFoundError } from "../errors";
import { Device } from "../models/device";

export const addDevice = async (req: Request, res: Response) => {
  const { deviceId, registrationId, identityKey, signedPreKey } = req.body;
  const user = await User.findOne({ clerkId: req.auth?.userId }, { _id: 1 });
  if (!user) {
    throw new NotFoundError();
  }
  const device = Device.build({
    userId: user.id,
    deviceId,
    registrationId,
    identityKey,
    signedPreKey,
  });
  await device.save();
  res.status(201).send(device);
};

export const getUserPublicBundle = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const device = await Device.findOne({ userId });
  if (!device) {
    throw new NotFoundError();
  }
  res.status(200).send(device);
};
