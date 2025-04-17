import mongoose from "mongoose";

export enum UserStatus {
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
}

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string;
  clerkId: string;
  avatarUrl: string;
  fullname: string;
  status: UserStatus;
  bio?: string;
  avatarKey?: string;
  lastSeen?: mongoose.Schema.Types.Date;
  updatedAt?: mongoose.Schema.Types.Date;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  clerkId: string;
  avatarUrl: string;
  fullname: string;
  status: UserStatus;
  bio?: string;
  avatarKey?: string;
  lastSeen?: mongoose.Schema.Types.Date;
  updatedAt?: mongoose.Schema.Types.Date;
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    clerkId: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    avatarKey: { type: String, default: "" },
    fullname: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      required: true,
    },
    bio: { type: String, default: "" },
    lastSeen: { type: mongoose.Schema.Types.Date },
    createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
    updatedAt: { type: mongoose.Schema.Types.Date },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.clerkId;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
