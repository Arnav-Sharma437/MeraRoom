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
    const slots = [1, 2, 3].map((slotId) => {
      const activeAd = ads.find((a) => a.slotId === slotId);
      return (
        activeAd ?? {
          slotId,
          businessName: '',
          contactNumber: '',
          startDate: null,
          endDate: null,
          amountPaid: 0,
          bannerUrl: '',
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
      { slotId: Number(body.slotId) },
      {
        $set: {
          businessName: body.businessName,
          contactNumber: body.contactNumber,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          amountPaid: Number(body.amountPaid),
          bannerUrl: body.bannerUrl,
          isPaid: !!body.isPaid,
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
    const slotId = searchParams.get('slotId');

    if (!slotId) {
      return NextResponse.json({ success: false, error: 'Slot ID is required' }, { status: 400 });
    }

    await Ad.findOneAndDelete({ slotId: Number(slotId) });

    return NextResponse.json({ success: true, message: `Ad slot ${slotId} cleared` });
  } catch (error) {
    console.error('DELETE /api/admin/ads error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
