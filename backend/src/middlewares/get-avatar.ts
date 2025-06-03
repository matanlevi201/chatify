import type { Request, Response } from "express";
import { getObject } from "../externals/storage";
import { NotFoundError } from "../errors";

export const getAvatar = async (req: Request, res: Response) => {
  const { key } = req.params;
  try {
    const stream = await getObject({
      fileKey: key ?? "",
    });

    res.setHeader("Content-Type", "image/jpeg");
    stream.pipe(res);
  } catch (err) {
    throw new NotFoundError();
  }
};
