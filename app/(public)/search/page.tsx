import { Suspense } from 'react';
import SearchPageClient from '@/components/search/SearchPageClient';
import Loader from '@/components/ui/Loader';

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
