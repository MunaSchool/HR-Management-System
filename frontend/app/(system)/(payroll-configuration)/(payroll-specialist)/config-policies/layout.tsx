import React from 'react';
import Link from 'next/link';

type Props = {
  readonly children: React.ReactNode;
};

export default function PayrollConfigLayout({ children }: Props) {
  // Replace this with real user/role retrieval when available
  const userRole = 'Payroll Specialist';

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar (empty for now) */}
      <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="h-16 flex items-center px-4 font-semibold">Payroll</div>
        <nav className="flex-1 p-4">{/* Sidebar links go here */}</nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header / Navbar */}
        <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur">
          <div className="flex items-center gap-4">
            <Link href="/" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Home
            </Link>
            <Link href="/profile" className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
              Profile
            </Link>
            <Link href="/payroll-configuration" className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Payroll
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Notifications</button>
            <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">
              <span className="font-medium">Role:</span>&nbsp;<span>{userRole}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}