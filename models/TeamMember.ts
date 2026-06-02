import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  category: 'core' | 'investor';
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, enum: ['core', 'investor'], default: 'core' },
    image: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  }
);

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember ?? mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);

export default TeamMember;
