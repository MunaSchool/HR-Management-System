// app/performance/page.tsx (Landing page)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { isHRAdmin, isManager } from '@/app/utils/roleCheck';

export default function PerformanceLandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Update the useEffect:
  useEffect(() => {
    if (!loading && user) {
      const isHR = isHRAdmin(user);
      const isMgr = isManager(user);
      const isRegularEmployee = !isHR && !isMgr;

      if (isRegularEmployee) {
        router.replace('/performance/employeeDashboard'); // ← Fixed
      } else if (isMgr && !isHR) {
        router.replace('/performance/assignments'); // ← Fixed
      } else {
        router.replace('/performance/adminDashboard'); // ← Fixed
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your performance dashboard...</p>
      </div>
    </div>
  );
}