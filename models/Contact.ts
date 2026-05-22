import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  phone: string;
  subject: string;
  message?: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Contact: Model<IContact> =
  mongoose.models.Contact ?? mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;
