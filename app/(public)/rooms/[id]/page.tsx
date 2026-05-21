import RoomDetailClient from '@/components/rooms/RoomDetailClient';

interface RoomDetailPageProps {
  params: { id: string };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return <RoomDetailClient id={params.id} />;
}
