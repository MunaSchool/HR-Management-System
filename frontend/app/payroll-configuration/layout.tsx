//import React, { useState } from 'react';
 "use client";
import Link from 'next/link';
import { useAuth } from "@/app/(system)/context/authContext";

type Props = {
  readonly children: React.ReactNode;
};

export default function PayrollConfigLayout({ children }: Props) {
  const { user } = useAuth();
  const roleLabel = user?.roles?.length ? user.roles.join(", ") : "Unknown";

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar (empty for now) */}
      <aside className="w-64 hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="h-16 flex items-center px-4 font-semibold">Payroll</div>
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <details className="group">
              <summary className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <span className="font-medium">Payroll Configs</span>
                <span className="text-sm text-gray-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="mt-2 pl-2 border-l border-gray-200 dark:border-gray-700">
                <ul className="space-y-1">
                  <li>
                    <Link href="/payroll-configuration/config-policies" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Policies
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/config-paygrade" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Pay Grades
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/config-paytypes" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Pay Types
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/config-allowances" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Allowances
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/config-benefits" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Termination & Resignation Benefits
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/insurance" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Insurance Brackets
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/config-signing-bonuses" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Signing Bonus
                    </Link>
                  </li>
                  <li>
                    <Link href="/payroll-configuration/company-settings" className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      Company Settings
                    </Link>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </nav>
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
              <span className="font-medium">Role:</span>&nbsp;<span>{roleLabel}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}