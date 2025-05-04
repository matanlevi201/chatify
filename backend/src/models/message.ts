import mongoose from "mongoose";
import type { UserDoc } from "./user";
import type { ConversationDoc } from "./conversation";

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  SEEN = "seen",
}

interface MessageAttrs {
  sender: string;
  content: string;
  readBy: string[];
  conversation: string;
}

interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

export interface MessageDoc extends mongoose.Document {
  sender: string;
  content: string;
  readBy: string[];
  conversation: string;
}

export interface PopulatedMessageDoc
  extends Omit<MessageDoc, "sender" | "conversation" | "readBy"> {
  sender: UserDoc;
  readBy: UserDoc[];
  conversation: ConversationDoc;
}

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: { type: String, required: false },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

messageSchema.set("timestamps", true);

const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  messageSchema
);

export { Message };
