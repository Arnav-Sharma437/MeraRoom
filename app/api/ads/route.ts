import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ad from '@/models/Ad';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ads = await Ad.find({
      isActive: true,
      isPaid: true,
      endDate: { $gte: today },
    }).lean();

    const { searchParams } = new URL(request.url);
    const slotParam = searchParams.get('slot');

    if (slotParam) {
      const slotNum = Number(slotParam);
      const ad = ads.find((a) => a.slot === slotNum) || null;
      return NextResponse.json({ success: true, data: ad });
    }

    const grouped = {
      slot1: ads.find((a) => a.slot === 1) || null,
      slot2: ads.find((a) => a.slot === 2) || null,
      slot3: ads.find((a) => a.slot === 3) || null,
    };

    return NextResponse.json({ success: true, data: grouped });
  } catch (error) {
    console.error('GET /api/ads error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
