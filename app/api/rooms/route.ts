import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import City from '@/models/City';
import { CITY } from '@/constants';
import { normalizePhone } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10'));
    const status = searchParams.get('status');
    const owner = searchParams.get('owner');
    const isFeatured = searchParams.get('isFeatured');
    const area = searchParams.get('area');
    const search = searchParams.get('search') || searchParams.get('q');
    const sort = searchParams.get('sort');
    
    const query: any = {};
    
    // Public search - default to only approved rooms
    if (!owner && !status) {
      query.status = 'approved';
    }
    
    // If status filter is active
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // If owner filter is active
    if (owner && owner !== 'all') {
      if (owner === 'me') {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        query.owner = session.user.id;
      } else {
        query.owner = owner;
      }
    }
    
    // Security check: if querying non-approved rooms, or rooms belonging to another owner, check credentials
    if (status === 'all' || query.status !== 'approved' || (owner && owner !== 'me')) {
      const session = await getServerSession(authOptions);
      const role = session?.user?.role;
      const userId = session?.user?.id;
      
      if (role !== 'admin') {
        // Non-admins can only view their own rooms
        if (userId) {
          if (query.owner && query.owner !== userId) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
          }
          query.owner = userId;
        } else {
          // Guests can only view approved rooms
          query.status = 'approved';
          delete query.owner;
        }
      }
    }
    
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    
    if (area) {
      const { DHARAMSHALA_AREAS } = await import('@/constants');
      const match = DHARAMSHALA_AREAS.find((a) => a.slug === area);
      query.area = match ? match.name : area;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort options
    let sortObj: any = { createdAt: -1 };
    if (sort === 'price-low') sortObj = { rent: 1 };
    else if (sort === 'price-high') sortObj = { rent: -1 };
    else if (sort === 'popular') sortObj = { views: -1 };
    
    const skip = (page - 1) * limit;
    const total = await Room.countDocuments(query);
    
    const rooms = await Room.find(query)
      .populate('owner', 'name phone whatsappNumber email')
      .populate('city', 'name slug state')
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();
      
    return NextResponse.json({
      success: true,
      data: rooms,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    let city = await City.findOne({ slug: CITY.slug });
    if (!city) {
      city = await City.create({
        name: CITY.name,
        slug: CITY.slug,
        state: CITY.state,
        image: '/images/cities/dharamshala.jpg',
        isActive: true,
        totalRooms: 0,
      });
    }
    
    const room = await Room.create({
      ...body,
      owner: session.user.id,
      city: city._id,
      status: session.user.role === 'admin' ? 'approved' : (body.status ?? 'pending'),
      isAvailable: true,
      views: 0,
      whatsappNumber: normalizePhone(body.whatsappNumber ?? body.phone ?? ''),
      createdAt: new Date(),
    });
    
    return NextResponse.json({
      success: true,
      data: room
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
