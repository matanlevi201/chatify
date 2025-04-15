import { getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { User } from "../models/user";

export const me = async (req: Request, res: Response) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });
  res.status(200).send(user);
};
