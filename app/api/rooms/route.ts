import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import { PAGINATION } from '@/constants';

function getSortOption(sort: string | null): Record<string, 1 | -1> {
  switch (sort) {
    case 'price-low':
      return { rent: 1 };
    case 'price-high':
      return { rent: -1 };
    case 'popular':
      return { views: -1 };
    default:
      return { createdAt: -1 };
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get('page') ?? String(PAGINATION.DEFAULT_PAGE), 10));
    const limit = Math.min(
      PAGINATION.MAX_LIMIT,
      Math.max(1, parseInt(searchParams.get('limit') ?? '9', 10))
    );
    const area = searchParams.get('area');
    const search = searchParams.get('q');
    const roomType = searchParams.get('roomType');
    const furnishing = searchParams.get('furnishing');
    const gender = searchParams.get('gender');
    const minRent = searchParams.get('minRent');
    const maxRent = searchParams.get('maxRent');
    const amenities = searchParams.get('amenities');
    const allowedFor = searchParams.get('allowedFor');
    const exclude = searchParams.get('exclude');
    const isFeatured = searchParams.get('isFeatured');
    const sort = searchParams.get('sort');
    const status = searchParams.get('status') ?? 'approved';

    const filter: Record<string, unknown> = { status, isAvailable: true };

    if (exclude) filter._id = { $ne: exclude };
    if (area) {
      const { DHARAMSHALA_AREAS } = await import('@/constants');
      const match = DHARAMSHALA_AREAS.find((a) => a.slug === area);
      if (match) filter.area = match.name;
    }
    if (search) {
      filter.$or = [
        { area: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }
    if (minRent || maxRent) {
      const rentFilter: Record<string, number> = {};
      if (minRent) rentFilter.$gte = Number(minRent);
      if (maxRent) rentFilter.$lte = Number(maxRent);
      filter.rent = rentFilter;
    }
    if (furnishing) filter.furnishing = furnishing;
    if (gender && gender !== 'any') filter.gender = gender;
    if (roomType && roomType !== 'all') {
      if (roomType === 'furnished') filter.furnishing = 'furnished';
      else if (roomType === 'ac') filter['amenities.ac'] = true;
      else if (roomType === 'wifi') filter['amenities.wifi'] = true;
      else filter.roomType = roomType;
    }
    if (amenities) {
      amenities.split(',').forEach((key) => {
        filter[`amenities.${key.trim()}`] = true;
      });
    }
    if (allowedFor) {
      allowedFor.split(',').forEach((key) => {
        filter[`allowedFor.${key.trim()}`] = true;
      });
    }
    if (isFeatured === 'true') filter.isFeatured = true;

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find(filter)
        .populate('city', 'name slug state')
        .populate('owner', 'name email phone')
        .sort(getSortOption(sort))
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
    return NextResponse.json({ success: false, error: 'Failed to fetch rooms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const room = await Room.create(body);
    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create room' }, { status: 500 });
  }
}
