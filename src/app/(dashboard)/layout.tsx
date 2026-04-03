import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
      <div className="shrink-0 z-50">
        <TopNav />
      </div>
      <div className="flex flex-1 min-w-0 overflow-hidden">
        <aside className="hidden md:flex shrink-0 h-full overflow-y-auto z-40">
          <Sidebar />
        </aside>
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
