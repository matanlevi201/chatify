import type { ClientSession } from "mongoose";
import mongoose from "mongoose";

export const transactionWrapper = async <T = void>(
  transaction: (session: ClientSession) => Promise<T>
) => {
  const session = await mongoose.startSession();
  try {
    return await session.withTransaction<T>(
      async () => await transaction(session)
    );
  } catch (error) {
    console.error("Transaction aborted:", error);
    throw error;
  } finally {
    session.endSession();
  }
};
