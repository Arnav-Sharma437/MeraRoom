import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import User from '@/models/User';
import Inquiry from '@/models/Inquiry';
import Payment from '@/models/Payment';
import { requireSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    const session = await requireSession();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    // Basic Counts
    const [
      totalRooms,
      pendingRooms,
      totalUsers,
      featuredRooms,
      verifiedRooms,
      inquiriesToday,
    ] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: 'pending' }),
      User.countDocuments({ role: 'user' }), // or all roles, let's do all user-level role users
      Room.countDocuments({ isFeatured: true }),
      Room.countDocuments({ isVerified: true }),
      Inquiry.countDocuments({ createdAt: { $gte: startOfToday } }),
    ]);

    // Total Revenue from Manual Payments
    const payments = await Payment.find({ status: 'paid' }).lean();
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

    // Revenue by Category for PieChart
    const featuredRevenue = payments
      .filter((p) => p.service === 'featured')
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const verifiedRevenue = payments
      .filter((p) => p.service === 'verified')
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const adRevenue = payments
      .filter((p) => p.service === 'ad')
      .reduce((sum, p) => sum + (p.amount ?? 0), 0);

    // Rooms by Area for BarChart
    const areaStats = await Room.aggregate([
      {
        $group: {
          _id: '$area',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const roomsByArea = areaStats.map((item) => ({
      name: item._id || 'Unknown',
      rooms: item.count,
    }));

    // Inquiries this week for LineChart (7 days)
    const inquiryStats = await Inquiry.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days
    const inquiriesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = inquiryStats.find((s) => s._id === dateStr);
      inquiriesByDay.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: dateStr,
        inquiries: match ? match.count : 0,
      });
    }

    // Recent Listings Table
    const recentListings = await Room.find()
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalRooms,
          pendingRooms,
          totalUsers,
          totalRevenue,
          featuredRooms,
          verifiedRooms,
          inquiriesToday,
          revenueBreakdown: {
            featured: featuredRevenue,
            verified: verifiedRevenue,
            ad: adRevenue,
          },
        },
        charts: {
          roomsByArea,
          inquiriesByDay,
        },
        recentListings,
      },
    });
  } catch (error) {
    console.error('Stats aggregation error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
