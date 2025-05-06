import mongoose from "mongoose";
import type { MessageDoc } from "./message";
import type { UserDoc } from "./user";

interface ConversationAttrs {
  name?: string;
  isGroup: boolean;
  avatarUrl?: string;
  participants: string[];
  lastMessage?: string;
  seenBy?: { [key: string]: Date };
  unseenCounts?: Map<string, number>;
}

interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

export interface ConversationDoc extends mongoose.Document {
  name: string;
  isGroup: boolean;
  avatarUrl: string;
  participants: string[];
  lastMessage?: string;
  seenBy: { [key: string]: Date };
  unseenCounts: Map<string, number>;
}

export interface PopulatedConversationDoc
  extends Omit<ConversationDoc, "participants" | "lastMessage"> {
  participants: UserDoc[];
  lastMessage: MessageDoc;
}

const conversationSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    isGroup: { type: Boolean, default: false, required: true },
    avatarUrl: { type: String, required: false },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    seenBy: {
      type: Map,
      of: Date,
      default: {},
    },
    unseenCounts: { type: Map, of: Number, default: {} },
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

conversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

conversationSchema.set("timestamps", true);

const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  "Conversation",
  conversationSchema
);

export { Conversation };
