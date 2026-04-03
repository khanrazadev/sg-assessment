'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, Folders, Settings2, Link2, LogOut, ClipboardList, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  {
    name: 'Findings', href: '/vcs', icon: ClipboardList, subItems: [
      { name: 'VCS', href: '/vcs' },
      { name: 'Cloud IAM', href: '' },
      { name: 'Cloud storage', href: '' },
      { name: 'Chat applications', href: '' },
      { name: 'Directory services', href: '' },
      { name: 'DevOps tools', href: '' },
      { name: 'Container registries', href: '' },
      { name: 'Other SaaS apps', href: '' },
    ]
  },
  { name: 'Manage scans', href: '/scans', icon: Settings2 },
];

const bottomItems = [
  { name: 'Integrations', href: '/integrations', icon: Link2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    document.cookie = 'sg_auth=; path=/; max-age=0; SameSite=Lax';
    router.push('/login');
  };

  return (
    <aside className={cn("border-r border-gray-200 bg-white flex flex-col h-full overflow-y-auto transition-all duration-300", isCollapsed ? "w-[60px]" : "w-64")}>
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        {!isCollapsed && <span className="font-semibold text-gray-800 text-sm"></span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className={cn("text-gray-500 hover:text-gray-900 focus:outline-none", isCollapsed && "mx-auto")}>
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) ||
            item.subItems?.some(sub => pathname.startsWith(sub.href));

          const renderedItem = (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center transition-colors rounded-md mx-2',
                  isCollapsed ? 'justify-center p-2' : 'px-3 py-2 text-sm',
                  isActive ? (isCollapsed ? 'bg-gray-100 text-gray-900' : 'bg-gray-100 text-gray-900 font-medium') : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>

              {/* Render SUB-ITEMS if we are in Findings */}
              {item.subItems && !isCollapsed && (
                <div className="mt-1 space-y-1">
                  {item.subItems.map(subItem => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          'flex relative items-center pl-12 pr-6 py-1.5 text-sm transition-colors',
                          isSubActive ? 'text-primary font-medium' : 'text-gray-500 hover:text-gray-900',
                        )}
                      >
                        <div className="absolute left-7 top-0 bottom-0 w-px bg-gray-200" />
                        <div className="absolute left-7 top-1/2 w-3 h-px bg-gray-200" />
                        <span className="relative z-10">{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          );

          return renderedItem;
        })}
      </div>

      <div className="border-t border-gray-100 p-4 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center transition-colors rounded-md mx-2 text-sm text-gray-600 hover:bg-gray-50",
              isCollapsed ? "justify-center p-2" : "px-3 py-2"
            )}
          >
            <item.icon className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center transition-colors rounded-md mx-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600",
            isCollapsed ? "justify-center p-2" : "px-3 py-2"
          )}
        >
          <LogOut className={cn("h-4 w-4 shrink-0", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
