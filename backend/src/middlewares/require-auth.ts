import type { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors";
import { getAuth } from "@clerk/express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(getAuth(req));
  console.log(req.auth);
  if (!req.auth?.userId) {
    throw new NotAuthorizedError();
  }
  next();
};
