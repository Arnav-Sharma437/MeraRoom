import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import { requireSession } from '@/lib/auth-server';

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

    await Room.findByIdAndUpdate(params.id, { $inc: { views: 1 } });

    return NextResponse.json({ success: true, data: room });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const check = await canManageRoom(params.id, session.user.id, session.user.role ?? 'user');
    if (!check.ok) {
      return NextResponse.json(
        { success: false, error: check.status === 404 ? 'Room not found' : 'Forbidden' },
        { status: check.status }
      );
    }

    const body = await request.json();
    delete body.owner;

    const room = await Room.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error('PUT /api/rooms/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update room' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
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
    return NextResponse.json({ success: false, error: 'Failed to delete room' }, { status: 500 });
  }
}
