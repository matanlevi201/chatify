import "dotenv/config";
import { app } from "./app";
import { env } from "./config/env";
import mongoose from "mongoose";

const initApp = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("Connected to MongoDb");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  app.listen(env.PORT || "1000", (error) => {
    if (error) return console.error(error);
    console.log(`Server listening on port: ${env.PORT}`);
  });
};

initApp();
