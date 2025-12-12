// app/performance/layout.tsx
"use client";

import { useAuth } from '@/app/(system)/context/authContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import PerformanceNavbar from './components/PerformanceNavbar';

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if user has access to performance module
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading performance module...</p>
        </div>
      </div>
    );
  }

  // Check if current route requires specific roles
  const requiresHR = pathname?.includes('/performance/hr') || 
                    pathname?.includes('/performance/templates/create') ||
                    pathname?.includes('/performance/cycles/create');
  
  const requiresManager = pathname?.includes('/performance/manager');
  
  const isHR = user?.roles?.includes('HR_MANAGER') || user?.roles?.includes('HR_ADMIN') || user?.roles?.includes('SYSTEM_ADMIN');
  const isManager = user?.roles?.includes('DEPARTMENT_HEAD');
  
  if (requiresHR && !isHR) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  if (requiresManager && !isManager) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">Only managers can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <PerformanceNavbar user={user} /> */}
      <main>{children}</main>
    </div>
  );
}