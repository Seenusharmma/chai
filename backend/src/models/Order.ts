import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderType: 'dine-in' | 'parcel';
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  userEmail?: string; // Optional for now, but used for history
  customerName: string;
  phoneNumber?: string; // Required for parcel
  address?: string; // Required for parcel
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderType: {
      type: String,
      required: true,
      enum: ['dine-in', 'parcel'],
    },
    items: [
      {
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined', 'completed'],
      default: 'pending',
    },
    userEmail: {
      type: String,
      required: false, // Make it optional if user doesn't log in, but requirement said "history for specific user email" so likely required for that feature.
    },
    customerName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: function (this: IOrder) {
        return this.orderType === 'parcel';
      },
    },
    address: {
      type: String,
      required: function (this: IOrder) {
        return this.orderType === 'parcel';
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
