import type { Metadata } from 'next';
import RoomDetailClient from '@/components/rooms/RoomDetailClient';
import { MOCK_FEATURED_ROOMS, getMockSearchRooms } from '@/constants';

interface RoomDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RoomDetailPageProps): Promise<Metadata> {
  const all = [...MOCK_FEATURED_ROOMS, ...getMockSearchRooms().slice(6)];
  const room = all.find((r) => r._id === params.id) ?? MOCK_FEATURED_ROOMS[0];
  const description = room.description.slice(0, 150);
  const title = `${room.title} in ${room.area}, Dharamshala | MeraRoom`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return <RoomDetailClient id={params.id} />;
}
