import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Room from '@/models/Room';
import { requireSession } from '@/lib/auth-server';

export async function GET() {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select('savedRooms').lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const rooms = await Room.find({
      _id: { $in: user.savedRooms ?? [] },
    })
      .populate('city', 'name slug state')
      .lean();

    return NextResponse.json({ success: true, data: rooms });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch saved rooms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId } = await request.json();
    if (!roomId) {
      return NextResponse.json({ success: false, error: 'roomId required' }, { status: 400 });
    }

    await connectDB();
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { savedRooms: roomId },
    });

    return NextResponse.json({ success: true, saved: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to save room' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    let roomId: string | null = null;
    try {
      const body = await request.json();
      roomId = body.roomId ?? null;
    } catch {
      roomId = request.nextUrl.searchParams.get('roomId');
    }

    if (!roomId) {
      return NextResponse.json({ success: false, error: 'roomId required' }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { savedRooms: roomId },
    });

    return NextResponse.json({ success: true, saved: false });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to unsave room' }, { status: 500 });
  }
}
