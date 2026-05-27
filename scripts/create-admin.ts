declare const process: {
  env: {
    MONGODB_URI?: string;
  };
  exit: (code?: number) => never;
  cwd: () => string;
};

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Fallback to load .env.local if not loaded by CLI config
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
}

async function createAdmin() {
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  // Bypassing Node querySrv DNS bug by transforming srv url to direct replicaSet hostnames
  if (uri.startsWith('mongodb+srv://') && uri.includes('katoch-farm.emz6vfj.mongodb.net')) {
    console.log('Resolving Atlas connection using direct replicaSet shard hostnames...');
    const hostMatch = uri.match(/mongodb\+srv:\/\/([^/?]+)/);
    if (hostMatch && hostMatch[1]) {
      const host = hostMatch[1];
      const credentials = uri.slice(14, uri.indexOf(host));
      const queryIndex = uri.indexOf('?');
      const queryParams = queryIndex > -1 ? uri.slice(queryIndex) : '';
      const pathAndQuery = queryIndex > -1 ? uri.slice(uri.indexOf(host) + host.length, queryIndex) : uri.slice(uri.indexOf(host) + host.length);
      
      const directHosts = 'ac-4ov6qeh-shard-00-00.emz6vfj.mongodb.net:27017,ac-4ov6qeh-shard-00-01.emz6vfj.mongodb.net:27017,ac-4ov6qeh-shard-00-02.emz6vfj.mongodb.net:27017';
      const separator = queryParams ? '&' : '?';
      
      uri = `mongodb://${credentials}${directHosts}${pathAndQuery}${queryParams}${separator}ssl=true&replicaSet=atlas-dpe4er-shard-0&authSource=admin`;
    }
  }

  await mongoose.connect(uri);
  
  const hash = await bcrypt.hash('Arnav@123', 10);
  
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Mongoose connection db is undefined');
  }
  
  await db.collection('users').deleteMany({});
  
  await db.collection('users').insertOne({
    name: 'Arnav',
    phone: '7876650437',
    password: hash,
    role: 'admin',
    isVerified: true,
    savedRooms: [],
    createdAt: new Date(),
  });
  
  console.log('✓ Admin created successfully!');
  console.log('Phone: 7876650437');
  console.log('Password: Arnav@123');
  
  process.exit(0);
}

createAdmin().catch(console.error);
