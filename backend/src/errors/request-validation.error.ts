import { CustomError } from "./custom.error";
import { z } from "zod";

export class RequestValidationError extends CustomError {
  statusCode = 406;

  constructor(public errors: z.ZodIssue[]) {
    super("Invalid request parameters");

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((issue: any) => ({
      message: `${issue.path.join(".")} is ${issue.message}`,
    }));
  }
}
