import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  // Security check
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== 'meraroom-setup-2024') {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401 }
    );
  }

  try {
    await connectDB();
    
    const { default: User } = await import('@/models/User');
    
    // Check if admin exists
    const existing = await User.findOne({ 
      phone: '7876650437',
    });
    
    if (existing) {
      // Update to admin role
      await User.updateOne(
        { phone: '7876650437' },
        { 
          $set: { 
            role: 'admin',
            isVerified: true,
            password: await bcrypt.hash('Arnav@123', 10),
          }, 
        }
      );
      return NextResponse.json({ 
        success: true, 
        message: 'Admin updated!',
        phone: '7876650437',
        password: 'Arnav@123',
      });
    }

    // Create new admin
    const hash = await bcrypt.hash('Arnav@123', 10);
    
    await User.create({
      name: 'Arnav',
      phone: '7876650437',
      password: hash,
      role: 'admin',
      isVerified: true,
      savedRooms: [],
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      success: true,
      message: 'Admin created successfully!',
      phone: '7876650437',
      password: 'Arnav@123',
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed', details: String(error) }, 
      { status: 500 }
    );
  }
}
