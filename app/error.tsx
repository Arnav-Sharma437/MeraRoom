'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0F0A] px-4 text-center">
      <h1 className="font-display text-4xl text-[#0F2E1E] dark:text-white mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3 min-h-[44px] hover:bg-[#D4AF37] hover:text-[#0F2E1E] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-[#0F2E1E] dark:border-[#D4AF37] text-[#0F2E1E] dark:text-[#D4AF37] font-semibold rounded-xl px-6 py-3 min-h-[44px] inline-flex items-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
