import type { Request, Response } from "express";
import { User, UserStatus } from "../models/user";

export const clerkWebhook = async (req: Request, res: Response) => {
  const { type, data } = req.body;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses[0]?.email_address;
    const newUser = User.build({
      email,
      clerkId: id,
      avatarUrl: image_url,
      fullname: `${first_name} ${last_name}`,
      status: UserStatus.ONLINE,
    });
    await newUser.save();
    res.status(201).send({ success: true });
  }
  res.status(200).send();
};
