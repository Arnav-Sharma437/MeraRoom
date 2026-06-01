import type { Metadata } from 'next';
import RoomDetailClient from '@/components/rooms/RoomDetailClient';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';

interface RoomDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  try {
    await connectDB();
    const room = await Room.findById(params.id).select('title area description').lean();

    if (!room) {
      return {
        title: 'Room Not Found | MeraRoom',
        description: 'This listing is no longer available.',
      };
    }

    const title = `${room.title} in ${room.area} | MeraRoom`;
    const description = room.description ? room.description.slice(0, 150) : '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
    };
  } catch (err) {
    console.error('Error generating room metadata:', err);
    return {
      title: 'MeraRoom — Dharamshala Stays',
      description: 'Find rooms and PGs in Dharamshala.',
    };
  }
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return <RoomDetailClient id={params.id} />;
}
