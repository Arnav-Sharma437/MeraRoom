'use client';

import OwnerSidebar from '@/components/dashboard/owner/OwnerSidebar';
import OwnerMobileTabs from '@/components/dashboard/owner/OwnerMobileTabs';

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F9F6EF] dark:bg-[#0A0F0A]">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <OwnerMobileTabs />
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
