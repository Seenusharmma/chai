import mongoose, { Document, Schema } from 'mongoose';

export interface ISize {
  name: 'small' | 'medium' | 'large';
  price: number;
}

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  sizes?: ISize[];
  isVeg?: boolean;
}

const SizeSchema = new Schema({
  name: { type: String, enum: ['small', 'medium', 'large'], required: true },
  price: { type: Number, required: true },
});

const MenuItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    sizes: [SizeSchema],
    isVeg: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
