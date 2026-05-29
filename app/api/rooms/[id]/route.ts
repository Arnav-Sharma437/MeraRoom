import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';

interface RouteParams {
  params: { id: string };
}

async function canManageRoom(roomId: string, userId: string, role: string) {
  const room = await Room.findById(roomId).select('owner').lean();
  if (!room) return { ok: false as const, status: 404 };
  if (role === 'admin' || room.owner.toString() === userId) {
    return { ok: true as const, room };
  }
  return { ok: false as const, status: 403 };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const room = await Room.findById(params.id)
      .populate('city', 'name slug state')
      .populate('owner', 'name email phone avatar')
      .lean();

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    // Increment views
    await Room.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const check = await canManageRoom(params.id, session.user.id, session.user.role ?? 'user');
    if (!check.ok) {
      return NextResponse.json(
        { success: false, error: check.status === 404 ? 'Room not found' : 'Forbidden' },
        { status: check.status }
      );
    }

    const body = await request.json();
    delete body.owner;

    const room = await Room.findByIdAndUpdate(params.id, { $set: body }, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error('PATCH /api/rooms/[id] error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

// Keep PUT support just in case
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return PATCH(request, { params });
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const check = await canManageRoom(params.id, session.user.id, session.user.role ?? 'user');
    if (!check.ok) {
      return NextResponse.json(
        { success: false, error: check.status === 404 ? 'Room not found' : 'Forbidden' },
        { status: check.status }
      );
    }

    await Room.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'Room deleted' });
  } catch (error) {
    console.error('DELETE /api/rooms/[id] error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
