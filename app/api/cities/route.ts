import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import City from '@/models/City';

export async function GET() {
  try {
    await connectDB();

    const cities = await City.find({ isActive: true })
      .sort({ totalRooms: -1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    console.error('GET /api/cities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const city = await City.create(body);

    return NextResponse.json(
      { success: true, data: city },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/cities error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create city' },
      { status: 500 }
    );
  }
}
