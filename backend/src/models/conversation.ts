import mongoose from "mongoose";

interface ConversationAttrs {
  name?: string;
  isGroup: boolean;
  avatarUrl?: string;
  participants: string[];
}

interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

export interface ConversationDoc extends mongoose.Document {
  name: string;
  isGroup: boolean;
  avatarUrl: string;
  participants: string[];
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
