import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { normalizePhone } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, role, whatsappNumber } = body;

    if (!name || !phone || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, phone and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedPhone = normalizePhone(phone);
    const existing = await User.findOne({ phone: normalizedPhone });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const userRole = role === 'owner' ? 'owner' : 'user';

    const user = await User.create({
      name,
      phone: normalizedPhone,
      email: `${normalizedPhone}@meraroom.local`,
      password: hashed,
      role: userRole,
      isVerified: false,
      ...(userRole === 'owner' && whatsappNumber
        ? { whatsappNumber: normalizePhone(whatsappNumber) }
        : {}),
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
