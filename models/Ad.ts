import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAd extends Document {
  slotId: number; // 1: Homepage top, 2: Search page sidebar, 3: Room detail
  businessName: string;
  contactNumber: string;
  startDate: Date;
  endDate: Date;
  amountPaid: number;
  bannerUrl: string;
  isPaid: boolean;
  createdAt: Date;
}

const AdSchema = new Schema<IAd>({
  slotId: { type: Number, required: true, unique: true },
  businessName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amountPaid: { type: Number, required: true },
  bannerUrl: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Ad: Model<IAd> =
  mongoose.models.Ad ?? mongoose.model<IAd>('Ad', AdSchema);

export default Ad;
