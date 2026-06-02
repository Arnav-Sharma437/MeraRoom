import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'admin';
    const all = request.nextUrl.searchParams.get('all') === 'true';

    const query = isAdmin && all ? {} : { isActive: true };
    let members = await TeamMember.find(query).sort({ order: 1 }).lean();
    
    // Seed initial 3 members if the collection is empty
    const totalCount = await TeamMember.countDocuments();
    if (totalCount === 0) {
      const initialSeed = [
        { name: 'Arnav', role: 'Co-Founder & Developer', order: 1, isActive: true },
        { name: 'Varun', role: 'Co-Founder & Operations', order: 2, isActive: true },
        { name: 'Shubham', role: 'Marketing & Growth', order: 3, isActive: true }
      ];
      await TeamMember.insertMany(initialSeed);
      members = await TeamMember.find(query).sort({ order: 1 }).lean();
    }
    
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('GET /api/team error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    if (!name || !role) {
      return NextResponse.json(
        { success: false, error: 'Name and role are required' },
        { status: 400 }
      );
    }

    const newMember = await TeamMember.create({
      name,
      role,
      image,
      order: Number(order) || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: newMember });
  } catch (error) {
    console.error('POST /api/team error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add team member' },
      { status: 500 }
    );
  }
}
