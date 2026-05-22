'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DashboardTopBar() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#16A34A] transition-colors duration-200"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}
