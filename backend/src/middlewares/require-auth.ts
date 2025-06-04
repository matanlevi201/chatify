import type { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.auth?.userId) {
    throw new NotAuthorizedError();
  }
  next();
};
