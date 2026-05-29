import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAd extends Document {
  slot: number; // 1, 2, or 3
  businessName: string;
  phone: string;
  bannerImage: string;
  linkUrl?: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  isPaid: boolean;
  amount: number;
  createdAt: Date;
}

const AdSchema = new Schema<IAd>({
  slot: { type: Number, enum: [1, 2, 3], required: true, unique: true },
  businessName: { type: String, required: true },
  phone: { type: String, required: true },
  bannerImage: { type: String, required: true },
  linkUrl: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  isPaid: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Ad: Model<IAd> =
  mongoose.models.Ad ?? mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
