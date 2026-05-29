import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Ad from '@/models/Ad';
import { requireSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const ads = await Ad.find().lean();

    // Map to slots 1, 2, and 3
    const slots = [1, 2, 3].map((slotNum) => {
      const activeAd = ads.find((a) => a.slot === slotNum);
      return (
        activeAd ?? {
          slot: slotNum,
          businessName: '',
          phone: '',
          startDate: null,
          endDate: null,
          amount: 0,
          bannerImage: '',
          linkUrl: '',
          isActive: false,
          isPaid: false,
        }
      );
    });

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('GET /api/admin/ads error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const ad = await Ad.findOneAndUpdate(
      { slot: Number(body.slot) },
      {
        $set: {
          businessName: body.businessName,
          phone: body.phone,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          amount: Number(body.amount),
          bannerImage: body.bannerImage,
          linkUrl: body.linkUrl ?? '',
          isPaid: !!body.isPaid,
          isActive: body.isActive !== undefined ? !!body.isActive : true,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: ad });
  } catch (error) {
    console.error('POST /api/admin/ads error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = request.nextUrl;
    const slot = searchParams.get('slot') || searchParams.get('slotId');

    if (!slot) {
      return NextResponse.json({ success: false, error: 'Slot number is required' }, { status: 400 });
    }

    await Ad.findOneAndDelete({ slot: Number(slot) });

    return NextResponse.json({ success: true, message: `Ad slot ${slot} cleared` });
  } catch (error) {
    console.error('DELETE /api/admin/ads error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
