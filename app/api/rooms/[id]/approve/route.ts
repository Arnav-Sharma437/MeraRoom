import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import { requireSession } from '@/lib/auth-server';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const updateData: Record<string, any> = { status: body.status };
    if (body.status === 'rejected') {
      updateData.rejectionReason = body.reason ?? '';
    } else if (body.status === 'approved') {
      updateData.rejectionReason = ''; // Clear rejection reason on approval
    }

    const room = await Room.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: room });
  } catch (error) {
    console.error('PATCH /api/rooms/[id]/approve error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
