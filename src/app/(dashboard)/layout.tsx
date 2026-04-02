import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-background font-sans overflow-hidden">
      {/* Top nav — fixed height, never scrolls */}
      <div className="shrink-0 z-50">
        <TopNav />
      </div>
      {/* Content row — fills remaining height */}
      <div className="flex flex-1 min-w-0 overflow-hidden">
        {/* Sidebar — full height, its own scroll if needed */}
        <aside className="hidden md:flex shrink-0 h-full overflow-y-auto z-40">
          <Sidebar />
        </aside>
        {/* Main — only this scrolls */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
