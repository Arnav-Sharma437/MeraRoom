import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentService = 'featured' | 'verified' | 'ad';
export type PaymentMethod = 'PhonePe' | 'GPay' | 'Cash';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface IPayment extends Document {
  ownerName: string;
  phone: string;
  service: PaymentService;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  date: Date;
  status: PaymentStatus;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  service: { type: String, enum: ['featured', 'verified', 'ad'], required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['PhonePe', 'GPay', 'Cash'], required: true },
  transactionId: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Payment: Model<IPayment> =
  mongoose.models.Payment ?? mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
