import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { normalizePhone } from '@/lib/utils';
import nodemailer from 'nodemailer';

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
      createdAt: new Date(),
    });

    console.log('SMTP_HOST exists:', 
      !!process.env.SMTP_HOST)
    console.log('SMTP_USER exists:', 
      !!process.env.SMTP_USER)
    console.log('SMTP_PASS exists:', 
      !!process.env.SMTP_PASS)
    console.log('Attempting to send email...')

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      const info = await transporter.sendMail({
        from: `"MeraRoom" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `New Contact Form: ${subject}`,
        text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,
      })
      
      console.log('Email sent successfully:', info.messageId)
      
    } catch (emailError) {
      console.error('EMAIL SENDING FAILED:', emailError)
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please WhatsApp us directly.' },
      { status: 500 }
    );
  }
}

