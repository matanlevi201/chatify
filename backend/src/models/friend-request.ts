import mongoose, { type ObjectId } from "mongoose";
import { type UserDoc } from "./user";

export enum RequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
}

interface FriendRequestAttrs {
  sender: ObjectId;
  receiver: ObjectId;
  status?: RequestStatus;
}

interface FriendRequestModel extends mongoose.Model<FriendRequestDoc> {
  build(attrs: FriendRequestAttrs): FriendRequestDoc;
}

interface FriendRequestDoc extends mongoose.Document {
  sender: ObjectId;
  receiver: ObjectId;
  status: RequestStatus;
}
export interface PopulatedFriendRequestDoc
  extends Omit<FriendRequestDoc, "sender" | "receiver"> {
  sender: UserDoc;
  receiver: UserDoc;
}
const friendRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      required: true,
      default: RequestStatus.PENDING,
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

friendRequestSchema.statics.build = (attrs: FriendRequestAttrs) => {
  return new FriendRequest(attrs);
};

friendRequestSchema.set("timestamps", true);

const FriendRequest = mongoose.model<FriendRequestDoc, FriendRequestModel>(
  "FriendRequest",
  friendRequestSchema
);

export { FriendRequest };
