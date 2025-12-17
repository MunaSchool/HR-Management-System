// app/performance/page.tsx
"use client";

import { useAuth } from "@/app/(system)/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  isSystemAdmin,
  isHRManager,
  isHREmployee,
  isLineManager,
  isEmployee,
} from "@/app/utils/roleCheck";

export default function PerformanceRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/auth/login");
      return;
    }

    // HR side: treat HR Employee/Manager/System Admin as "admin dashboard"
    if (isSystemAdmin(user) || isHRManager(user) || isHREmployee(user)) {
      router.replace("/performance/adminDashboard");
      return;
    }

    // Line manager
    if (isLineManager(user)) {
      router.replace("/performance/managerDashboard");
      return;
    }

    // Regular employee
    if (isEmployee(user)) {
      router.replace("/performance/employeeDashboard");
      return;
    }

    router.replace("/performance/unauthorized");
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to your performance dashboard...</p>
    </div>
  );
}
