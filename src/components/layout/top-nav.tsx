'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Settings, CheckCircle } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 shrink-0 min-w-0">
      <div className="flex items-center shrink-0">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="StackGuard Logo" width={42} height={42} className="object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-6 min-w-0">
        <button className="text-gray-500 hover:text-gray-900 transition-colors shrink-0">
          <Search className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors shrink-0">
          <Settings className="h-5 w-5" />
        </button>
        <button className="text-gray-500 hover:text-gray-900 transition-colors shrink-0">
          <CheckCircle className="h-5 w-5" />
        </button>
        <div className="flex items-center border-l pl-3 md:pl-6 gap-2 min-w-0">
          <span className="text-sm font-medium text-gray-700 truncate max-w-[120px] md:max-w-none">Security Admin</span>
        </div>
      </div>
    </header>
  );
}
