import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICity extends Document {
  name: string;
  slug: string;
  state: string;
  image: string;
  isActive: boolean;
  totalRooms: number;
}

const CitySchema = new Schema<ICity>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    totalRooms: { type: Number, default: 0 },
  },
  { timestamps: false }
);

const City: Model<ICity> =
  mongoose.models.City ?? mongoose.model<ICity>('City', CitySchema);

export default City;
