import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { normalizePhone } from '@/lib/utils';

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, phone, subject, message } = body;

    if (!name || !phone || !subject) {
      return NextResponse.json(
        { success: false, error: 'Name, phone, and subject are required' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      phone: normalizePhone(phone),
      subject,
      message: message ?? '',
      status: 'new',
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
