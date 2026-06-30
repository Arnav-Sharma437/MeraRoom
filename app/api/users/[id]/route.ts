import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireSession } from '@/lib/auth-server';
import bcrypt from 'bcryptjs';

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
    const { name, role, password } = body;

    const updateFields: any = {};
    if (name) updateFields.name = name;
    if (role && isAdmin) {
      if (['user', 'owner', 'admin'].includes(role)) {
        updateFields.role = role;
      } else {
        return NextResponse.json({ success: false, error: 'Invalid role' }, { status: 400 });
      }
    }
    
    if (password && isAdmin) {
      if (password.length < 6) {
        return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
      }
      const hashed = await bcrypt.hash(password, 10);
      updateFields.password = hashed;
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

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    
    // Check if user is deleting themselves
    if (params.id === session.user.id) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own admin account' }, { status: 400 });
    }

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}
