import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { requireSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const settingsList = await Settings.find().lean();

    // Map list to a single key-value object
    const settings = settingsList.reduce((acc, s) => {
      acc[s.key] = s.value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('GET /api/admin/settings error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    // Upsert each setting key-value pair
    const promises = Object.entries(body).map(([key, value]) =>
      Settings.findOneAndUpdate(
        { key },
        { $set: { value, updatedAt: new Date() } },
        { upsert: true, new: true }
      )
    );
    await Promise.all(promises);

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('PATCH /api/admin/settings error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
