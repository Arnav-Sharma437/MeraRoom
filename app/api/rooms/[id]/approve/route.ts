import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin only' },
        { status: 403 }
      );
    }
    
    const body = await req.json();
    const { status, reason } = body;
    
    const updateData: Record<string, any> = { 
      status,
      ...(reason && { rejectionReason: reason }),
      ...(status === 'approved' && { approvedAt: new Date(), rejectionReason: '' })
    };
    
    const room = await Room.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );
    
    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: room
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
