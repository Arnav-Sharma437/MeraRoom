import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';
import Room from '@/models/Room';
import { normalizePhone } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const roomId = searchParams.get('room');
    const status = searchParams.get('status');

    const filter: Record<string, any> = {};

    if (owner) {
      const ownerId = owner === 'me' ? session.user.id : owner;
      // Allow only the owner themselves or admin to query their inquiries
      if (ownerId !== session.user.id && session.user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      const rooms = await Room.find({ owner: ownerId }).select('_id').lean();
      filter.room = { $in: rooms.map((r) => r._id) };
    } else if (roomId) {
      const room = await Room.findById(roomId).select('owner').lean();
      if (!room) {
        return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
      }
      if (room.owner.toString() !== session.user.id && session.user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      filter.room = roomId;
    } else {
      // No filters - admin only
      if (session.user.role !== 'admin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    const inquiries = await Inquiry.find(filter)
      .populate({
        path: 'room',
        select: 'title area rent whatsappNumber owner',
      })
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, message, roomId } = body;

    if (!name || !phone || !roomId) {
      return NextResponse.json(
        { success: false, error: 'Name, phone and roomId are required' },
        { status: 400 }
      );
    }

    const room = await Room.findById(roomId).lean();
    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    // Optional user session if logged in
    const session = await getServerSession(authOptions);

    const inquiry = await Inquiry.create({
      name,
      phone: normalizePhone(phone),
      message: message ?? '',
      room: roomId,
      user: session?.user?.id || undefined,
      status: 'new',
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
