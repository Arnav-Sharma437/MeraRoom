import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0F0A] px-4 text-center">
      <Home className="w-16 h-16 text-[#16A34A]/30 mb-4 animate-bounce" />
      <h1 className="font-display text-4xl text-[#0F2E1E] dark:text-white mb-2">
        Page not found
      </h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-[#16A34A] text-white font-semibold rounded-xl px-6 py-3 min-h-[44px] inline-flex items-center justify-center"
        >
          Go Home
        </Link>
        <Link
          href="/search"
          className="border border-[#0F2E1E] dark:border-[#D4AF37] text-[#0F2E1E] dark:text-[#D4AF37] font-semibold rounded-xl px-6 py-3 min-h-[44px] inline-flex items-center justify-center gap-1.5"
        >
          <Search size={16} /> Search Rooms
        </Link>
      </div>
    </div>
  );
}
