import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
