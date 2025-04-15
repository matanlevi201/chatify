import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  res.status(500).send({
    errors: [{ message: "Something went wrong" }],
  });
  return;
};
