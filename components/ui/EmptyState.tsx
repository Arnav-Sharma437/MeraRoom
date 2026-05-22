'use client';

import Link from 'next/link';
import { Home, Search } from 'lucide-react';

interface EmptyStateProps {
  onClear?: () => void;
}

export default function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <Home className="w-16 h-16 mx-auto mb-4 text-[#16A34A]/30" />
      <h3 className="font-display text-xl text-[#0F2E1E] dark:text-white mb-2">
        No rooms found
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm mx-auto">
        Try adjusting your filters or search in a different area of Dharamshala.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="border border-[#0F2E1E] dark:border-[#D4AF37] text-[#0F2E1E] dark:text-[#D4AF37] font-semibold rounded-xl px-6 py-3"
          >
            Clear Filters
          </button>
        )}
        <Link
          href="/search"
          className="bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3 inline-flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Browse All Rooms
        </Link>
      </div>
    </div>
  );
}
