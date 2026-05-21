import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import { PAGINATION } from '@/constants';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(
      1,
      parseInt(searchParams.get('page') ?? String(PAGINATION.DEFAULT_PAGE), 10)
    );
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(
        1,
        parseInt(
          searchParams.get('limit') ?? String(PAGINATION.DEFAULT_LIMIT),
          10
        )
      )
    );
    const city = searchParams.get('city');
    const isFeatured = searchParams.get('isFeatured');
    const status = searchParams.get('status') ?? 'approved';

    const filter: Record<string, unknown> = {
      status,
      isAvailable: true,
    };

    if (city) filter.city = city;
    if (isFeatured === 'true') filter.isFeatured = true;

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate('city', 'name slug state')
        .populate('owner', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Room.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: rooms,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const room = await Room.create(body);

    return NextResponse.json(
      { success: true, data: room },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create room' },
      { status: 500 }
    );
  }
}
