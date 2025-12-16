// app/performance/page.tsx (Landing page)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/(system)/context/authContext';
import { debugRoles, hasRole, isHRAdmin, isHROnly, isHRAndManager, isManager, isManagerOnly, isRegularEmployee } from '@/app/utils/roleCheck';

export default function PerformanceLandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Update the useEffect:
  // Add this useEffect at the top of your PerformanceLayout component
useEffect(() => {
  if (user) {
    console.log('=== DEBUG USER ROLES ===');
    console.log('User object:', JSON.stringify(user, null, 2));
    console.log('User roles (raw):', user?.roles   || user?.roles);
    
    // Test each role check
    console.log('isHRAdmin(user):', isHRAdmin(user));
    console.log('isManager(user):', isManager(user));
    console.log('isRegularEmployee(user):', isRegularEmployee(user));
    console.log('isManagerOnly(user):', isManagerOnly(user));
    console.log('isHROnly(user):', isHROnly(user));
    console.log('isHRAndManager(user):', isHRAndManager(user));
    
    // Check specific roles
    console.log('Has DEPARTMENT_MANAGER:', hasRole(user, ['DEPARTMENT_MANAGER']));
    console.log('Has DEPARTMENT_HEAD:', hasRole(user, ['DEPARTMENT_HEAD']));
    console.log('Has MANAGER:', hasRole(user, ['MANAGER']));
    console.log('Has HR_MANAGER:', hasRole(user, ['HR_MANAGER']));
    console.log('Has HR_ADMIN:', hasRole(user, ['HR_ADMIN']));
    
    // Call debugRoles function if you want detailed info
    debugRoles(user);
  }
}, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your performance dashboard...</p>
      </div>
    </div>
  );
}