/**
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 * Or: node --loader ts-node/esm scripts/seed.ts
 *
 * Seeds Dharamshala city + sample rooms into MongoDB.
 */
import mongoose from 'mongoose';
import { seedCityDocument, seedRoomsData } from '../lib/seed-data';

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('Set MONGODB_URI in .env.local');
  }

  await mongoose.connect(MONGODB_URI);

  const City = (await import('../models/City')).default;
  const Room = (await import('../models/Room')).default;
  const User = (await import('../models/User')).default;

  let city = await City.findOne({ slug: seedCityDocument.slug });
  if (!city) {
    city = await City.create(seedCityDocument);
  }

  let owner = await User.findOne({ email: 'owner@meraroom.in' });
  if (!owner) {
    const bcrypt = await import('bcryptjs');
    owner = await User.create({
      name: 'MeraRoom Owner',
      email: 'owner@meraroom.in',
      phone: '917876650437',
      password: await bcrypt.hash('meraroom123', 10),
      role: 'owner',
      isVerified: true,
    });
  }

  await Room.deleteMany({ area: { $in: seedRoomsData.map((r) => r.area) } });

  await Room.insertMany(
    seedRoomsData.map((room) => ({
      ...room,
      owner: owner!._id,
      city: city!._id,
      latitude: 32.219,
      longitude: 76.3234,
    }))
  );

  await City.findByIdAndUpdate(city._id, {
    totalRooms: await Room.countDocuments({ city: city._id, status: 'approved' }),
  });

  await mongoose.disconnect();
}

seed().catch(() => process.exit(1));
