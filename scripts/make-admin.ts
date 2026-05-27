import mongoose from 'mongoose';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually to get MONGODB_URI
let MONGODB_URI = '';
try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
  const match = envContent.match(/MONGODB_URI\s*=\s*([^\r\n]*)/);
  if (match && match[1]) {
    MONGODB_URI = match[1].trim();
  }
} catch (err) {
  console.log('Could not read .env.local file, trying defaults...');
}

if (MONGODB_URI === 'your_mongodb_connection_string' || !MONGODB_URI) {
  MONGODB_URI = 'mongodb://127.0.0.1:27017/meraroom';
}

async function run() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);

  const phone = '7876650437';
  const hashed = await bcrypt.hash('arnav123', 10);

  // Delete existing users matching this phone number (checking standard, 91, and +91 formats)
  console.log('Searching for existing users with phone:', phone);
  const deleteResult = await User.deleteMany({
    phone: { $in: [phone, '91' + phone, '+91' + phone] }
  });
  console.log(`Deleted ${deleteResult.deletedCount} user(s).`);

  // Create the admin user
  const admin = await User.create({
    name: 'Arnav Sharma (Admin)',
    phone: phone,
    email: 'admin@meraroom.in',
    password: hashed,
    role: 'admin',
    isVerified: true
  });

  console.log('Successfully created Admin user:');
  console.log('ID:', admin._id.toString());
  console.log('Name:', admin.name);
  console.log('Phone:', admin.phone);
  console.log('Role:', admin.role);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error running script:', err);
  process.exit(1);
});
