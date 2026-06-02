import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' }, 
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { name, role, image, order, isActive } = body;

    const member = await TeamMember.findById(params.id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    if (name !== undefined) member.name = name;
    if (role !== undefined) member.role = role;
    if (image !== undefined) member.image = image;
    if (order !== undefined) member.order = Number(order);
    if (isActive !== undefined) member.isActive = isActive;

    await member.save();

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error('PATCH /api/team/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' }, 
        { status: 403 }
      );
    }

    await connectDB();

    const member = await TeamMember.findByIdAndDelete(params.id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/team/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
