import mongoose, { Schema, Document, Model } from 'mongoose';

export type RoomType =
  | 'single'
  | 'shared'
  | 'studio'
  | 'pg'
  | '1bhk'
  | '2bhk';

export type Furnishing = 'furnished' | 'semi-furnished' | 'unfurnished';
export type GenderPreference = 'male' | 'female' | 'any';
export type RoomStatus = 'pending' | 'approved' | 'rejected';

export interface IRoomAmenities {
  wifi: boolean;
  ac: boolean;
  parking: boolean;
  parkingTwoWheeler: boolean;
  parkingFourWheeler: boolean;
  attachedBath: boolean;
  kitchen: boolean;
  laundry: boolean;
  tv: boolean;
  powerBackup: boolean;
  security: boolean;
  gym: boolean;
}

export interface IRoomAllowedFor {
  students: boolean;
  working: boolean;
  family: boolean;
  bachelors: boolean;
}

export interface IRoom extends Document {
  owner: mongoose.Types.ObjectId;
  title: string;
  description: string;
  rent: number;
  deposit: number;
  city: mongoose.Types.ObjectId;
  area: string;
  address: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  roomType: RoomType;
  furnishing: Furnishing;
  gender: GenderPreference;
  amenities: IRoomAmenities;
  allowedFor: IRoomAllowedFor;
  whatsappNumber: string;
  status: RoomStatus;
  isFeatured: boolean;
  featuredUntil?: Date;
  isVerified: boolean;
  verifiedAt?: Date;
  rejectionReason?: string;
  isAvailable: boolean;
  views: number;
  createdAt: Date;
}

const AmenitiesSchema = new Schema<IRoomAmenities>(
  {
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    parkingTwoWheeler: { type: Boolean, default: false },
    parkingFourWheeler: { type: Boolean, default: false },
    attachedBath: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    powerBackup: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
  },
  { _id: false }
);

const AllowedForSchema = new Schema<IRoomAllowedFor>(
  {
    students: { type: Boolean, default: false },
    working: { type: Boolean, default: false },
    family: { type: Boolean, default: false },
    bachelors: { type: Boolean, default: false },
  },
  { _id: false }
);

const RoomSchema = new Schema<IRoom>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, default: 0 },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    area: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
    images: [{ type: String }],
    roomType: {
      type: String,
      enum: ['single', 'shared', 'studio', 'pg', '1bhk', '2bhk'],
      required: true,
    },
    furnishing: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any',
    },
    amenities: { type: AmenitiesSchema, default: () => ({}) },
    allowedFor: { type: AllowedForSchema, default: () => ({}) },
    whatsappNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    rejectionReason: { type: String },
    isAvailable: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const Room: Model<IRoom> =
  mongoose.models.Room ?? mongoose.model<IRoom>('Room', RoomSchema);

export default Room;
