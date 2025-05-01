import cors from "cors";
import express from "express";
import { json } from "body-parser";
import { env } from "./config/env";
import {
  ConversationRouter,
  FriendRouter,
  RequestRouter,
  UserRouter,
  WebhooksRouter,
} from "./routes";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler } from "./middlewares";

const app = express();

app.use(json());
app.use(
  cors({
    origin: env.FRONTEND_URL, // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(clerkMiddleware());
app.use("/api/conversations", ConversationRouter);
app.use("/api/friends", FriendRouter);
app.use("/api/requests", RequestRouter);
app.use("/api/users", UserRouter);
app.use("/api/webhooks", WebhooksRouter);

app.use(errorHandler);

export { app };
