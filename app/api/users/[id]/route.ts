import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireSession } from '@/lib/auth-server';

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (params.id !== 'me' && params.id !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const userId = params.id === 'me' ? session.user.id : params.id;
    const user = await User.findById(userId)
      .select('-password')
      .populate('savedRooms')
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.role === 'admin';
    const targetId = params.id === 'me' ? session.user.id : params.id;

    if (targetId !== session.user.id && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();
    const { name, role } = body;

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (role && isAdmin) {
      if (['user', 'owner', 'admin'].includes(role)) {
        updateFields.role = role;
      } else {
        return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
      }
    }

    const user = await User.findByIdAndUpdate(
      targetId,
      updateFields,
      { new: true, runValidators: true }
    )
      .select('-password')
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('PATCH /api/users/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}
