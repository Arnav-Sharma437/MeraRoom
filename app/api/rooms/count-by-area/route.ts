import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';

export async function GET() {
  try {
    await connectDB()
    
    const counts = await Room.aggregate([
      { 
        $match: { status: 'approved' } 
      },
      { 
        $group: { 
          _id: '$area', 
          count: { $sum: 1 } 
        } 
      }
    ])
    
    // Convert to object: { "McLeod Ganj": 3 }
    const countMap: Record<string, number> = {}
    counts.forEach((item: any) => {
      if (item._id) {
        countMap[item._id] = item.count
      }
    })
    
    return NextResponse.json({
      success: true,
      data: countMap
    })
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
