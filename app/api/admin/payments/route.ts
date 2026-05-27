import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Payment from '@/models/Payment';
import { requireSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const payments = await Payment.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('GET /api/admin/payments error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const body = await request.json();

    const payment = await Payment.create({
      ownerName: body.ownerName,
      phone: body.phone,
      service: body.service,
      amount: Number(body.amount),
      paymentMethod: body.paymentMethod,
      transactionId: body.transactionId,
      date: body.date ? new Date(body.date) : new Date(),
      status: body.status ?? 'pending',
    });

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/payments error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
