import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'user' | 'owner' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  savedRooms: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['user', 'owner', 'admin'],
      default: 'user',
    },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    savedRooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema);

export default User;
