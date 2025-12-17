'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const managerLinks = [
  { href: '/dashboard/manager', label: 'Overview' },          // 🔹 add home
  { href: '/dashboard/manager/leaves', label: 'Leaves dashboard' },
  { href: '/dashboard/manager/requests', label: 'Requests' },
  { href: '/dashboard/manager/team', label: 'Team' },
];

export default function ManagerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <div className="p-4 text-lg font-semibold">Manager</div>
        <nav className="space-y-1 px-2">
          {managerLinks.map(link => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100',
                  isActive
                    ? 'bg-gray-900 text-white hover:bg-gray-900'
                    : 'text-gray-700'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
