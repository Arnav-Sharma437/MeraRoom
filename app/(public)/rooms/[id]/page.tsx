interface RoomDetailPageProps {
  params: { id: string };
}

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-brand-gray">Room {params.id} — UI coming soon</p>
    </div>
  );
}
