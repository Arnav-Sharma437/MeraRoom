import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';

export async function GET() {
  try {
    await connectDB();
    
    // Aggregation to find approved room counts grouped by area name
    const areaCounts = await Room.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$area', count: { $sum: 1 } } }
    ]);
    
    // Convert to a lowercase key map for easier lookup
    const countsMap: Record<string, number> = {};
    areaCounts.forEach((item) => {
      if (item._id) {
        countsMap[item._id.toLowerCase().trim()] = item.count;
      }
    });

    return NextResponse.json({ success: true, data: countsMap });
  } catch (error) {
    console.error('Failed to get area room counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch counts' }, 
      { status: 500 }
    );
  }
}
