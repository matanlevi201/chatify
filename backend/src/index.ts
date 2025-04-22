import "dotenv/config";
import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import mongoose from "mongoose";
import initSocket from "./socket";

const initApp = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  const server = http.createServer(app);
  const { onlineUsers } = initSocket(server);
  app.onlineUsers = onlineUsers;

  server.listen(env.PORT || "1000", () => {
    // if (error) return console.error(error);
    console.log(`Server listening on port: ${env.PORT}`);
  });
};

initApp();
