import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { DHARAMSHALA_AREAS } from '@/constants';

export async function GET() {
  try {
    await connectDB();
    const customLocationsSetting = await Settings.findOne({ key: 'custom_locations' }).lean();

    if (customLocationsSetting && customLocationsSetting.value) {
      return NextResponse.json({ success: true, data: customLocationsSetting.value });
    }

    // Fallback if no custom locations are set
    const fallback = DHARAMSHALA_AREAS.map((a) => ({
      ...a,
      isActive: true,
    }));

    return NextResponse.json({ success: true, data: fallback });
  } catch (error) {
    console.error('GET /api/locations error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
