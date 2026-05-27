import OwnerSidebar from '@/components/dashboard/owner/OwnerSidebar';
import OwnerMobileTabs from '@/components/dashboard/owner/OwnerMobileTabs';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import MobileTopBar from '@/components/layout/MobileTopBar';

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9F6EF] dark:bg-[#0A0F0A]">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden">
          <MobileTopBar />
        </div>
        <OwnerMobileTabs />
        <div className="flex-1 p-4 md:p-8">
          <DashboardTopBar />
          {children}
        </div>
      </div>
    </div>
  );
}
