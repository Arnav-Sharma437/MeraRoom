import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  room: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  message: string;
  phone: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ??
  mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
