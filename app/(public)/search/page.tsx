import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchPageClient from '@/components/search/SearchPageClient';
import Loader from '@/components/ui/Loader';

export const metadata: Metadata = {
  title: 'Rooms in Dharamshala | MeraRoom',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
