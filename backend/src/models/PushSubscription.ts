import mongoose, { Schema, Document } from 'mongoose';

export interface IPushSubscription extends Document {
  userEmail: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  createdAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>({
  userEmail: { type: String, required: true },
  subscription: {
    endpoint: { type: String, required: true },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

export const PushSubscription = mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);
