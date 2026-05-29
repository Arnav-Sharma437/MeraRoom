import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';
import Payment from '@/models/Payment';
import Contact from '@/models/Contact';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden' }, 
        { status: 403 }
      );
    }

    const [
      totalRooms,
      pendingRooms,
      approvedRooms,
      rejectedRooms,
      totalUsers,
      totalOwners,
      totalInquiries,
      newInquiries,
      featuredRooms,
      verifiedRooms,
      recentRooms,
      payments,
      unreadContacts
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: 'pending' }),
      Room.countDocuments({ status: 'approved' }),
      Room.countDocuments({ status: 'rejected' }),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'owner' }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Room.countDocuments({ isFeatured: true }),
      Room.countDocuments({ isVerified: true }),
      Room.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('owner', 'name phone')
        .lean(),
      Payment.find({ status: 'paid' }).lean(),
      Contact.countDocuments({ status: 'new' })
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
    
    // Rooms by area aggregation
    const roomsByArea = await Room.aggregate([
      { $match: { status: 'approved' } },
      { $group: { 
        _id: '$area', 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const roomsByAreaFormatted = roomsByArea.map((item) => ({
      name: item._id || 'Unknown',
      rooms: item.count,
    }));

    // Generate trend data for the LineChart
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const inquiryWeeklyStats = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const inquiriesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = inquiryWeeklyStats.find((s) => s._id === dateStr);
      inquiriesByDay.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        inquiries: match ? match.count : 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRooms,
          pendingRooms,
          approvedRooms,
          rejectedRooms,
          totalUsers,
          totalOwners,
          totalInquiries,
          newInquiries,
          featuredRooms,
          verifiedRooms,
          totalRevenue,
          unreadContacts,
        },
        charts: {
          roomsByArea: roomsByAreaFormatted,
          inquiriesByDay,
        },
        recentListings: recentRooms,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
