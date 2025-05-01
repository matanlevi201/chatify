import mongoose from "mongoose";

interface DeviceAttrs {
  userId: string;
  deviceId: string;
  registrationId: string;
  identityKey: string;
  signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
}

interface DeviceModel extends mongoose.Model<DeviceDoc> {
  build(attrs: DeviceAttrs): DeviceDoc;
}

export interface DeviceDoc extends mongoose.Document {
  userId: string;
  deviceId: string;
  registrationId: string;
  identityKey: string;
  signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
}

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    registrationId: { type: String, required: true },
    deviceId: { type: String, required: true },
    identityKey: { type: String, required: true },
    signedPreKey: {
      keyId: { type: Number, required: true },
      publicKey: { type: String, required: true },
      signature: { type: String, required: true },
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

deviceSchema.statics.build = (attrs: DeviceAttrs) => {
  return new Device(attrs);
};

deviceSchema.set("timestamps", true);

const Device = mongoose.model<DeviceDoc, DeviceModel>("Device", deviceSchema);

export { Device };
