import mongoose, { Schema, Document, Model } from 'mongoose';

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface IInquiry extends Document {
  room: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  message?: string;
  status: InquiryStatus;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry ?? mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
