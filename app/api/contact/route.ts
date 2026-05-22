import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { normalizePhone } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, subject, message } = body;

    if (!name || !phone || !subject) {
      return NextResponse.json(
        { success: false, error: 'Name, phone and subject are required' },
        { status: 400 }
      );
    }

    await connectDB();

    await Contact.create({
      name,
      phone: normalizePhone(phone),
      subject,
      message: message ?? '',
      status: 'new',
    });

    return NextResponse.json({
      success: true,
      message: "Message sent! We'll reply soon.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please WhatsApp us directly.' },
      { status: 500 }
    );
  }
}
