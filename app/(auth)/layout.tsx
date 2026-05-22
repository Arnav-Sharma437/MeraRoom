export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-white dark:bg-[#0A0F0A] lg:relative lg:inset-auto lg:z-auto lg:min-h-screen lg:overflow-visible">
      {children}
    </div>
  );
}
